import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListItem } from '@/components/ui/list-item';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Stepper } from '@/components/ui/stepper';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/status-views';
import { Text } from '@/components/ui/text';
import { useCartStore } from '@/features/cart/cart-store';
import { NutritionTable } from '@/features/catalog/components/nutrition-table';
import { PriceHistoryChart } from '@/features/catalog/components/price-history-chart';
import { ProductImage } from '@/features/catalog/components/product-image';
import { useProduct } from '@/features/catalog/hooks';
import { useCityStore } from '@/features/city/city-store';
import { useTheme } from '@/hooks/use-theme';
import { formatDayMonth, formatPrice, formatWeight } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

/** Карточка товара: фото, цена, КБЖУ, история цены и магазины с наличием (ТЗ, п. 5.2.3). */
export default function ProductScreen() {
  const colors = useTheme();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const city = useCityStore((state) => state.city);
  const product = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const inCart = useCartStore(
    (state) => state.items.find((entry) => entry.product.id === productId)?.quantity ?? 0,
  );

  if (!city) {
    return (
      <Screen>
        <EmptyView
          icon="pin"
          title="Город не выбран"
          description="Цены и наличие зависят от города."
          action={<Button title="Выбрать город" onPress={() => router.push('/city')} />}
        />
      </Screen>
    );
  }
  if (product.isPending) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }
  if (product.isError) {
    return (
      <Screen>
        <ErrorView error={product.error} onRetry={() => product.refetch()} />
      </Screen>
    );
  }

  const item = product.data;
  const meta = [item.net_weight ? formatWeight(item.net_weight) : null, item.barcode]
    .filter(Boolean)
    .join(' · ');
  const bestPrice = item.offers[0]?.price;

  return (
    <Screen>
      <Stack.Screen options={{ title: '' }} />

      <Card padded={false}>
        <ProductImage product={item} style={styles.image} iconSize={56} />
        <View style={styles.summary}>
          <View style={styles.titles}>
            <Text variant="title">{item.name}</Text>
            {item.brand ? <Text color="textSecondary">{item.brand}</Text> : null}
          </View>

          <View style={styles.buyRow}>
            <View style={styles.price}>
              {item.min_price !== null ? (
                <>
                  <Text variant="display" color="primary">
                    {formatPrice(item.min_price)}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    минимум в городе {city.name}
                  </Text>
                </>
              ) : (
                <Text color="textSecondary">Цен пока нет</Text>
              )}
            </View>
            {inCart > 0 ? (
              <Stepper size="lg" value={inCart} onChange={(next) => setQuantity(item.id, next)} />
            ) : (
              <Button title="В корзину" icon="plus" onPress={() => addItem(item)} />
            )}
          </View>

          {meta ? (
            <Text variant="caption" color="textSecondary">
              {meta}
            </Text>
          ) : null}
        </View>
      </Card>

      {item.nutrition ? (
        <Card>
          <SectionHeader title="КБЖУ" note="на 100 г / мл" />
          <NutritionTable nutrition={item.nutrition} />
        </Card>
      ) : null}

      {item.price_history.length > 1 ? (
        <Card>
          <SectionHeader title="История минимальной цены" />
          <PriceHistoryChart history={item.price_history} />
        </Card>
      ) : null}

      {item.offers.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Цены по магазинам" />
          <Card padded={false}>
            {item.offers.map((offer, index) => (
              <ListItem
                key={offer.store_id}
                icon="store"
                title={offer.store_name}
                subtitle={`Обновлено ${formatDayMonth(offer.updated_at)}`}
                divider={index < item.offers.length - 1}
                right={
                  <View style={styles.offerPrice}>
                    <Text variant="label" style={styles.offerValue}>
                      {formatPrice(offer.price)}
                    </Text>
                    {offer.price === bestPrice ? (
                      <View style={[styles.best, { backgroundColor: colors.tint }]}>
                        <Text variant="overline" color="primary" style={styles.bestText}>
                          лучшая
                        </Text>
                      </View>
                    ) : null}
                  </View>
                }
                onPress={() =>
                  router.push({
                    pathname: '/stores/[storeId]',
                    params: { storeId: offer.store_id },
                  })
                }
              />
            ))}
          </Card>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 1.5 },
  summary: { padding: Spacing.lg, gap: Spacing.md },
  titles: { gap: 2 },
  buyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  price: { flex: 1 },
  section: { gap: Spacing.md },
  offerPrice: { alignItems: 'flex-end', gap: 3 },
  offerValue: { fontSize: 16 },
  best: { paddingHorizontal: 7, paddingVertical: 1, borderRadius: Radius.pill },
  bestText: { fontSize: 11, lineHeight: 15 },
});
