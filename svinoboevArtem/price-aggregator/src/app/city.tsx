import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListItem } from '@/components/ui/list-item';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { ErrorView, LoadingView } from '@/components/ui/status-views';
import { useCityStore } from '@/features/city/city-store';
import { useCities, useDetectCity } from '@/features/city/hooks';
import { useTheme } from '@/hooks/use-theme';
import { ApiError, getErrorMessage } from '@/lib/api/errors';
import { Spacing } from '@/theme';

/** Выбор города: автоопределение по GPS или вручную из списка (ТЗ, п. 4.2). */
export default function CityScreen() {
  const colors = useTheme();
  const selectedId = useCityStore((state) => state.city?.id);
  const setCity = useCityStore((state) => state.setCity);
  const cities = useCities();
  const detect = useDetectCity();
  const notSupported = detect.error instanceof ApiError && detect.error.status === 404;

  return (
    <Screen>
      <Button
        title="Определить по геопозиции"
        icon="location"
        variant="soft"
        loading={detect.isPending}
        onPress={() => detect.mutate(undefined, { onSuccess: () => router.back() })}
      />
      {detect.isError ? (
        <Notice
          tone={notSupported ? 'warning' : 'danger'}
          text={
            notSupported
              ? 'Рядом с вами пока нет поддерживаемого города. Выберите его из списка.'
              : getErrorMessage(detect.error)
          }
        />
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Доступные города" />
        {cities.isPending ? <LoadingView /> : null}
        {cities.isError ? (
          <ErrorView error={cities.error} onRetry={() => cities.refetch()} />
        ) : null}
        {cities.data ? (
          <Card padded={false}>
            {cities.data.map((city, index) => (
              <ListItem
                key={city.id}
                icon="city"
                title={city.name}
                divider={index < cities.data.length - 1}
                right={
                  city.id === selectedId ? (
                    <Icon name="check" size={18} color={colors.primary} />
                  ) : null
                }
                onPress={() => {
                  setCity(city);
                  router.back();
                }}
              />
            ))}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { flexGrow: 1, gap: Spacing.md },
});
