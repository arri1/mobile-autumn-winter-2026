import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyView } from '@/components/ui/status-views';
import { Text } from '@/components/ui/text';
import { selectEstimatedTotal, selectItemsCount, useCartStore } from '@/features/cart/cart-store';
import { CartItemRow } from '@/features/cart/components/cart-item-row';
import { CartNutritionSummary } from '@/features/cart/components/cart-nutrition-summary';
import { OptimizationResult } from '@/features/cart/components/optimization-result';
import { routeInputKey, useOptimizeCart } from '@/features/cart/hooks';
import type { OptimizationMode, RouteOrigin } from '@/features/cart/types';
import { useCityStore } from '@/features/city/city-store';
import { getErrorMessage } from '@/lib/api/errors';
import { formatPrice, plural } from '@/lib/format';
import { Spacing } from '@/theme';

const MODES: Record<OptimizationMode, string> = {
  cheapest: 'Дешевле',
  fastest: 'Меньше остановок',
};

const ORIGINS: Record<RouteOrigin, string> = {
  gps: 'Где я сейчас',
  city: 'Центр города',
};

const RADII_KM = [1, 3, 5, 10];

/** Корзина: товары, КБЖУ, параметры оптимизации и маршрут (ТЗ, п. 4.6 и 5.2.4). */
export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectItemsCount);
  const total = useCartStore(selectEstimatedTotal);
  const settings = useCartStore((state) => state.settings);
  const updateSettings = useCartStore((state) => state.updateSettings);
  const clear = useCartStore((state) => state.clear);
  const city = useCityStore((state) => state.city);
  const optimize = useOptimizeCart();
  // Маршрут показываем, только пока он соответствует текущей корзине, городу и настройкам.
  const route =
    optimize.data?.inputKey === routeInputKey(city?.id, items, settings) ? optimize.data : null;

  if (items.length === 0) {
    return (
      <Screen>
        <EmptyView
          icon="cart"
          title="Корзина пуста"
          description="Добавляйте товары из каталога — посчитаем КБЖУ и подберём магазины."
          action={<Button title="Открыть каталог" onPress={() => router.navigate('/catalog')} />}
        />
      </Screen>
    );
  }

  function confirmClear() {
    Alert.alert('Очистить корзину?', 'Все товары будут убраны из списка.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: clear,
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.section}>
        <SectionHeader
          title={`${count} ${plural(count, ['товар', 'товара', 'товаров'])}`}
          note={total > 0 ? `от ${formatPrice(total)}` : null}
          action={<Button title="Очистить" variant="ghost" size="sm" onPress={confirmClear} />}
        />
        <Card padded={false}>
          {items.map((item, index) => (
            <CartItemRow key={item.product.id} item={item} divider={index < items.length - 1} />
          ))}
        </Card>
      </View>

      <CartNutritionSummary />

      <Card>
        <SectionHeader title="Маршрут за покупками" />

        <View style={styles.group}>
          <Text variant="overline" color="textSecondary">
            Что важнее
          </Text>
          <View style={styles.chips}>
            {(Object.keys(MODES) as OptimizationMode[]).map((mode) => (
              <Chip
                key={mode}
                label={MODES[mode]}
                selected={settings.mode === mode}
                onPress={() => updateSettings({ mode })}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Text variant="overline" color="textSecondary">
            Откуда выезжаем
          </Text>
          <View style={styles.chips}>
            {(Object.keys(ORIGINS) as RouteOrigin[]).map((origin) => (
              <Chip
                key={origin}
                label={ORIGINS[origin]}
                icon={origin === 'gps' ? 'location' : 'city'}
                selected={settings.origin === origin}
                onPress={() => updateSettings({ origin })}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Text variant="overline" color="textSecondary">
            Радиус поиска магазинов
          </Text>
          <View style={styles.chips}>
            {RADII_KM.map((radiusKm) => (
              <Chip
                key={radiusKm}
                label={`${radiusKm} км`}
                selected={settings.radiusKm === radiusKm}
                onPress={() => updateSettings({ radiusKm })}
              />
            ))}
          </View>
        </View>

        {optimize.isError ? (
          <Notice
            tone="danger"
            text={
              settings.origin === 'gps'
                ? `${getErrorMessage(optimize.error)}. Можно построить маршрут от центра города.`
                : getErrorMessage(optimize.error)
            }
          />
        ) : null}
        {city ? (
          <Button
            title="Построить маршрут"
            icon="route"
            loading={optimize.isPending}
            onPress={() => optimize.mutate()}
          />
        ) : (
          <Button title="Выбрать город" icon="pin" onPress={() => router.push('/city')} />
        )}
      </Card>

      {route ? <OptimizationResult route={route} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.md },
  group: { gap: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
