import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/status-views';
import { Text } from '@/components/ui/text';
import { ProductGrid } from '@/features/catalog/components/product-grid';
import { useProducts } from '@/features/catalog/hooks';
import { useCityStore } from '@/features/city/city-store';
import { StoreMap } from '@/features/stores/components/store-map';
import { StoreReviewForm } from '@/features/stores/components/store-review-form';
import { PRICE_LEVEL_LABELS, STORE_TYPE_LABELS_SINGULAR } from '@/features/stores/constants';
import { useStore } from '@/features/stores/hooks';
import type { Store } from '@/features/stores/types';
import { useTheme } from '@/hooks/use-theme';
import { plural } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

/** Карточка магазина: сведения, точка на карте, товары с ценами и отзыв (ТЗ, п. 5.2.2). */
export default function StoreScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const cityId = useCityStore((state) => state.city?.id);
  const store = useStore(storeId);
  const products = useProducts({ storeId });

  if (store.isPending) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }
  if (store.isError) {
    return (
      <Screen>
        <ErrorView error={store.error} onRetry={() => store.refetch()} />
      </Screen>
    );
  }

  const data = store.data;

  return (
    <Screen>
      <Stack.Screen options={{ title: data.name }} />

      <Card>
        <View style={styles.titles}>
          <Text variant="title">{data.name}</Text>
          <Text color="textSecondary">{STORE_TYPE_LABELS_SINGULAR[data.store_type]}</Text>
        </View>
        <View style={styles.facts}>
          <Fact icon="pin" text={data.address} />
          {data.opening_hours ? <Fact icon="clock" text={data.opening_hours} /> : null}
          <Fact
            icon="star"
            text={
              data.rating !== null
                ? `${data.rating.toFixed(1).replace('.', ',')} — рейтинг покупателей`
                : 'Пока нет оценок'
            }
          />
          {data.price_level !== null ? (
            <Fact icon="tag" text={PRICE_LEVEL_LABELS[data.price_level]} />
          ) : null}
        </View>
        <View style={styles.map}>
          <StoreMap
            center={data.location}
            zoom={14.5}
            stores={[data]}
            selectedStoreId={data.id}
            interactive={false}
          />
        </View>
        <Button
          title="Проложить путь в картах"
          icon="route"
          variant="soft"
          onPress={() => openInMaps(data)}
        />
      </Card>

      <View style={styles.section}>
        <SectionHeader
          title="Товары и цены"
          note={
            products.data
              ? `${products.data.length} ${plural(products.data.length, ['товар', 'товара', 'товаров'])}`
              : null
          }
        />
        {products.isPending && cityId ? <LoadingView /> : null}
        {products.isError ? (
          <ErrorView error={products.error} onRetry={() => products.refetch()} />
        ) : null}
        {products.data?.length === 0 ? (
          <EmptyView title="Цен пока нет" description="В этом магазине ещё нет данных о товарах." />
        ) : null}
        {products.data ? <ProductGrid products={products.data} /> : null}
      </View>

      {cityId ? <StoreReviewForm storeId={data.id} cityId={cityId} /> : null}
    </Screen>
  );
}

function Fact({ icon, text }: { icon: IconName; text: string }) {
  const colors = useTheme();
  return (
    <View style={styles.fact}>
      <Icon name={icon} size={16} color={icon === 'star' ? colors.star : colors.primary} />
      <Text style={styles.factText}>{text}</Text>
    </View>
  );
}

/** Открывает системные карты с маршрутом до магазина. */
function openInMaps({ name, location: { lat, lon } }: Store) {
  const label = encodeURIComponent(name);
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${lat},${lon}&q=${label}`
      : `geo:${lat},${lon}?q=${lat},${lon}(${label})`;
  Linking.openURL(url).catch(() => undefined);
}

const styles = StyleSheet.create({
  titles: { gap: 2 },
  facts: { gap: Spacing.sm },
  fact: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  factText: { flex: 1 },
  map: { height: 160, borderRadius: Radius.lg, overflow: 'hidden' },
  section: { gap: Spacing.md },
});
