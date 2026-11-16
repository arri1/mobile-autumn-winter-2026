import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { selectItemsCount, useCartStore } from '@/features/cart/cart-store';
import { useTheme } from '@/hooks/use-theme';

/** Разделы приложения из ТЗ (п. 5.2): карта, магазины, товары, корзина, личный кабинет. */
export default function TabsLayout() {
  const colors = useTheme();
  const cartCount = useCartStore(selectItemsCount);

  return (
    <NativeTabs tintColor={colors.primary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Карта</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stores">
        <NativeTabs.Trigger.Label>Магазины</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'storefront', selected: 'storefront.fill' }}
          md="storefront"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="catalog">
        <NativeTabs.Trigger.Label>Товары</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
          md="category"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label>Корзина</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'cart', selected: 'cart.fill' }}
          md="shopping_cart"
        />
        {/* hidden работает только для бейджа без текста, поэтому при 0 текст не передаём. */}
        <NativeTabs.Trigger.Badge hidden={cartCount === 0}>
          {cartCount > 0 ? String(cartCount) : undefined}
        </NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Профиль</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
