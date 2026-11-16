import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListItem } from '@/components/ui/list-item';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { ErrorView, LoadingView } from '@/components/ui/status-views';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useDeleteAccount, useMe, useSignOut, useUpdateProfile } from '@/features/auth/hooks';
import { useSessionStore } from '@/features/auth/session-store';
import type { UserProfile } from '@/features/auth/types';
import { useCityStore } from '@/features/city/city-store';
import type { ReceiptStatus } from '@/features/scanner/api';
import { useReceipts } from '@/features/scanner/hooks';
import { useMyReviews } from '@/features/stores/hooks';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api/errors';
import { formatDayMonth } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

/** Личный кабинет: профиль, город, чеки, отзывы и управление данными (ТЗ, п. 4.1 и 5.2.5). */
export default function ProfileScreen() {
  const status = useSessionStore((state) => state.status);
  const city = useCityStore((state) => state.city);

  return (
    <Screen>
      {status === 'loading' ? <LoadingView /> : null}
      {status === 'guest' ? <GuestCard /> : null}
      {status === 'authenticated' ? <ProfileCard /> : null}

      <Card padded={false}>
        <ListItem
          icon="pin"
          title="Город"
          subtitle={city?.name ?? 'Не выбран'}
          onPress={() => router.push('/city')}
        />
        <ListItem
          icon="scan"
          title="Сканер"
          subtitle="Штрихкод товара или QR-код чека"
          divider={false}
          onPress={() => router.push('/scanner')}
        />
      </Card>

      {status === 'authenticated' ? <AccountSections /> : null}
    </Screen>
  );
}

const BENEFITS: { icon: IconName; text: string }[] = [
  { icon: 'receipt', text: 'Отправляйте чеки — цены в каталоге станут точнее' },
  { icon: 'star', text: 'Оценивайте магазины и оставляйте отзывы' },
  { icon: 'person', text: 'История чеков и отзывов в одном месте' },
];

function GuestCard() {
  const colors = useTheme();
  return (
    <Card>
      <View style={styles.titles}>
        <Text variant="title">Войдите в приложение</Text>
        <Text color="textSecondary">
          Каталог, карта и маршруты работают и без входа. С аккаунтом доступно больше:
        </Text>
      </View>
      <View style={styles.benefits}>
        {BENEFITS.map(({ icon, text }) => (
          <View key={text} style={styles.benefit}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.tint }]}>
              <Icon name={icon} size={16} color={colors.primary} />
            </View>
            <Text style={styles.benefitText}>{text}</Text>
          </View>
        ))}
      </View>
      <Button title="Войти по коду" onPress={() => router.push('/sign-in')} />
    </Card>
  );
}

function ProfileCard() {
  const me = useMe();

  if (me.isPending) {
    return (
      <Card>
        <LoadingView />
      </Card>
    );
  }
  if (me.isError) {
    return (
      <Card>
        <ErrorView error={me.error} onRetry={() => me.refetch()} />
      </Card>
    );
  }
  return <ProfileEditor profile={me.data} />;
}

function ProfileEditor({ profile }: { profile: UserProfile }) {
  const colors = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.display_name ?? '');
  const update = useUpdateProfile();
  const contact = profile.email ?? profile.phone ?? '';
  const initial = (profile.display_name ?? contact).trim().charAt(0).toUpperCase() || '?';

  function startEditing() {
    setName(profile.display_name ?? '');
    update.reset();
    setEditing(true);
  }

  return (
    <Card>
      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text variant="title" color="onPrimary">
            {initial}
          </Text>
        </View>
        <View style={styles.identityText}>
          <Text variant="heading" numberOfLines={1}>
            {profile.display_name ?? 'Без имени'}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {contact}
          </Text>
        </View>
        {!editing ? (
          <Button title="Изменить" variant="soft" size="sm" icon="pencil" onPress={startEditing} />
        ) : null}
      </View>

      {editing ? (
        <>
          <TextField
            label="Как к вам обращаться"
            placeholder="Имя"
            value={name}
            onChangeText={setName}
            maxLength={100}
            autoFocus
            autoComplete="name"
            textContentType="name"
            returnKeyType="done"
            error={update.isError ? getErrorMessage(update.error) : null}
          />
          <View style={styles.actions}>
            <Button
              title="Отмена"
              variant="secondary"
              style={styles.action}
              onPress={() => setEditing(false)}
            />
            <Button
              title="Сохранить"
              style={styles.action}
              loading={update.isPending}
              onPress={() => update.mutate(name.trim(), { onSuccess: () => setEditing(false) })}
            />
          </View>
        </>
      ) : null}
    </Card>
  );
}

const RECEIPT_STATUS: Record<ReceiptStatus, string> = {
  pending: 'В обработке',
  processed: 'Обработан',
  rejected: 'Отклонён',
};

function AccountSections() {
  const colors = useTheme();
  const cityName = useCityStore((state) => state.city?.name);
  const receipts = useReceipts();
  const reviews = useMyReviews();
  const signOut = useSignOut();
  const deleteAccount = useDeleteAccount();

  function confirmDeletion() {
    Alert.alert(
      'Удалить аккаунт?',
      'Профиль, история чеков и отзывы будут удалены без возможности восстановления.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => deleteAccount.mutate() },
      ],
    );
  }

  return (
    <>
      <View style={styles.section}>
        <SectionHeader title="Мои чеки" />
        <Card padded={false}>
          {receipts.isPending ? <LoadingView /> : null}
          {receipts.isError ? (
            <ErrorView error={receipts.error} onRetry={() => receipts.refetch()} />
          ) : null}
          {receipts.data?.length === 0 ? (
            <View style={styles.placeholder}>
              <Text color="textSecondary">Отсканируйте QR-код на чеке — он появится здесь.</Text>
            </View>
          ) : null}
          {receipts.data?.map((receipt, index) => (
            <ListItem
              key={receipt.id}
              icon="receipt"
              title={`Чек от ${formatDayMonth(receipt.created_at)}`}
              subtitle={RECEIPT_STATUS[receipt.status]}
              divider={index < receipts.data.length - 1}
            />
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Мои отзывы" note={cityName} />
        <Card padded={false}>
          {reviews.isPending && cityName ? <LoadingView /> : null}
          {reviews.isError ? (
            <ErrorView error={reviews.error} onRetry={() => reviews.refetch()} />
          ) : null}
          {!cityName || reviews.data?.length === 0 ? (
            <View style={styles.placeholder}>
              <Text color="textSecondary">
                {cityName
                  ? 'Оценить магазин можно на его странице.'
                  : 'Выберите город, чтобы увидеть отзывы.'}
              </Text>
            </View>
          ) : null}
          {reviews.data?.map((review, index) => (
            <ListItem
              key={review.store_id}
              icon="store"
              title={review.store_name}
              subtitle={review.text || null}
              divider={index < reviews.data.length - 1}
              right={
                <View style={styles.rating}>
                  <Icon name="star" size={13} color={colors.star} />
                  <Text variant="label">{review.rating}</Text>
                </View>
              }
              onPress={() =>
                router.push({
                  pathname: '/stores/[storeId]',
                  params: { storeId: review.store_id },
                })
              }
            />
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        {deleteAccount.isError ? (
          <Notice tone="danger" text={getErrorMessage(deleteAccount.error)} />
        ) : null}
        <Button
          title="Выйти"
          icon="exit"
          variant="secondary"
          loading={signOut.isPending}
          onPress={() => signOut.mutate()}
        />
        <Button
          title="Удалить аккаунт и данные"
          variant="danger"
          loading={deleteAccount.isPending}
          onPress={confirmDeletion}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titles: { gap: Spacing.xs },
  benefits: { gap: Spacing.md },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { flex: 1 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1 },
  section: { gap: Spacing.md },
  placeholder: { padding: Spacing.lg },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
