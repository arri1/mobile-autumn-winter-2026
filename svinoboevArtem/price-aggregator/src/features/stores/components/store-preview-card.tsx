import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { Elevation, Radius, Spacing } from '@/theme';

import { PRICE_LEVEL_LABELS, STORE_TYPE_LABELS_SINGULAR } from '../constants';
import type { Store } from '../types';

type StorePreviewCardProps = {
  store: Store;
  onClose: () => void;
};

/** Плавающая карточка магазина, выбранного на карте. */
export function StorePreviewCard({ store, onClose }: StorePreviewCardProps) {
  const colors = useTheme();
  const facts = [
    STORE_TYPE_LABELS_SINGULAR[store.store_type],
    store.price_level !== null ? PRICE_LEVEL_LABELS[store.price_level] : null,
    store.opening_hours,
  ].filter(Boolean);

  return (
    <View
      style={[
        styles.card,
        Elevation,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text variant="heading" numberOfLines={1}>
            {store.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {store.address}
          </Text>
        </View>
        {store.rating !== null ? (
          <View style={[styles.rating, { backgroundColor: colors.surface }]}>
            <Icon name="star" size={13} color={colors.star} />
            <Text variant="label">{store.rating.toFixed(1).replace('.', ',')}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Закрыть карточку магазина"
          hitSlop={10}
          onPress={onClose}
          style={[styles.close, { backgroundColor: colors.surface }]}>
          <Icon name="close" size={12} color={colors.textSecondary} />
        </Pressable>
      </View>
      <Text variant="caption" color="textSecondary" numberOfLines={1}>
        {facts.join(' · ')}
      </Text>
      <Button
        title="Товары и цены"
        icon="basket"
        onPress={() =>
          router.push({ pathname: '/stores/[storeId]', params: { storeId: store.id } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  titles: { flex: 1, gap: 2 },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 30,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.pill,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
