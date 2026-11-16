import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { SectionHeader } from '@/components/ui/section-header';
import { StatTile } from '@/components/ui/stat-tile';
import { Text } from '@/components/ui/text';
import { StoreMap } from '@/features/stores/components/store-map';
import { useTheme } from '@/hooks/use-theme';
import { formatDistance, formatDuration, formatPrice, plural } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

import { useCartStore } from '../cart-store';
import type { OptimizedRoute } from '../hooks';

/** Результат расчёта: итоги, маршрут на карте и разбивка товаров по магазинам. */
export function OptimizationResult({ route }: { route: OptimizedRoute }) {
  const colors = useTheme();
  const { result, origin } = route;
  const names = useCartStore((state) => state.items);
  const nameOf = (productId: string) =>
    names.find((item) => item.product.id === productId)?.product.name ?? 'Товар';
  const stores = result.stops.map((stop) => stop.store);

  if (stores.length === 0) {
    return (
      <Card>
        <SectionHeader title="Маршрут" />
        <Notice
          tone="warning"
          text="В выбранном радиусе нет магазинов с товарами из корзины. Увеличьте радиус поиска."
        />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader
        title="Маршрут"
        note={`${stores.length} ${plural(stores.length, ['остановка', 'остановки', 'остановок'])}`}
      />

      <View style={styles.stats}>
        <StatTile value={formatPrice(result.total_cost)} label="к оплате" />
        {result.distance_m !== null ? (
          <StatTile value={formatDistance(result.distance_m)} label="путь" />
        ) : null}
        {result.duration_s !== null ? (
          <StatTile value={formatDuration(result.duration_s)} label="в дороге" />
        ) : null}
      </View>

      <View style={styles.map}>
        <StoreMap
          center={origin}
          zoom={12}
          stores={stores}
          route={result.route}
          origin={origin}
          interactive={false}
        />
      </View>

      {result.route_source === 'estimate' ? (
        <Notice text="Маршрут показан по прямой: расстояние примерное, время в пути недоступно." />
      ) : null}

      <View>
        {result.stops.map((stop, index) => (
          <Pressable
            key={stop.store.id}
            accessibilityRole="button"
            accessibilityLabel={`Остановка ${index + 1}: ${stop.store.name}`}
            onPress={() =>
              router.push({ pathname: '/stores/[storeId]', params: { storeId: stop.store.id } })
            }
            style={({ pressed }) => [styles.stop, { opacity: pressed ? 0.7 : 1 }]}>
            <View style={styles.rail}>
              <View style={[styles.number, { backgroundColor: colors.primary }]}>
                <Text variant="overline" color="onPrimary">
                  {index + 1}
                </Text>
              </View>
              {index < result.stops.length - 1 ? (
                <View style={[styles.line, { backgroundColor: colors.border }]} />
              ) : null}
            </View>
            <View style={styles.stopBody}>
              <View style={styles.stopHeader}>
                <Text variant="label" numberOfLines={1} style={styles.stopName}>
                  {stop.store.name}
                </Text>
                <Text variant="label">{formatPrice(stop.subtotal)}</Text>
                <Icon name="chevronRight" size={12} color={colors.textSecondary} />
              </View>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {stop.store.address}
              </Text>
              {stop.items.map((item) => (
                <View key={item.product_id} style={styles.item}>
                  <Text variant="caption" numberOfLines={1} style={styles.itemName}>
                    {nameOf(item.product_id)}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {item.quantity} × {formatPrice(item.price)}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </View>

      {result.missing_product_ids.length > 0 ? (
        <Notice
          tone="warning"
          text={`Не найдено в радиусе поиска: ${result.missing_product_ids.map(nameOf).join(', ')}.`}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: Spacing.sm },
  map: { height: 220, borderRadius: Radius.lg, overflow: 'hidden' },
  stop: { flexDirection: 'row', gap: Spacing.md },
  rail: { alignItems: 'center', width: 26 },
  number: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { flex: 1, width: 2, marginVertical: 4, borderRadius: 1 },
  stopBody: { flex: 1, gap: 4, paddingBottom: Spacing.lg },
  stopHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 26 },
  stopName: { flex: 1, fontSize: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  itemName: { flex: 1 },
});
