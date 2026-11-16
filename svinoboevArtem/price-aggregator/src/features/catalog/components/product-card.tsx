import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Stepper } from '@/components/ui/stepper';
import { Text } from '@/components/ui/text';
import { useCartStore } from '@/features/cart/cart-store';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice, formatWeight } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

import type { ProductSummary } from '../types';
import { ProductImage } from './product-image';

/** Карточка товара в сетке каталога: фото, цена «от» и быстрое добавление в корзину. */
export function ProductCard({ product }: { product: ProductSummary }) {
  const colors = useTheme();
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.product.id === product.id)?.quantity ?? 0,
  );
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const meta = [product.brand, product.net_weight ? formatWeight(product.net_weight) : null]
    .filter(Boolean)
    .join(' · ');

  // Ссылка на товар и кнопки корзины — соседи, а не вложенные элементы:
  // иначе VoiceOver видит карточку как один элемент и до «плюса» не добраться.
  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={product.name}
        onPress={() =>
          router.push({
            pathname: '/catalog/product/[productId]',
            params: { productId: product.id },
          })
        }
        style={({ pressed }) => [styles.link, { opacity: pressed ? 0.8 : 1 }]}>
        <ProductImage product={product} style={styles.image} />
        <View style={styles.body}>
          <Text variant="label" numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>
          <Text variant="overline" color="textSecondary" numberOfLines={1}>
            {meta || ' '}
          </Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        {quantity > 0 ? (
          <Stepper value={quantity} onChange={(next) => setQuantity(product.id, next)} />
        ) : (
          <>
            <View style={styles.price}>
              <Text variant="overline" color="textSecondary">
                {product.min_price !== null ? 'от' : 'нет цены'}
              </Text>
              {product.min_price !== null ? (
                <Text variant="heading" numberOfLines={1}>
                  {formatPrice(product.min_price)}
                </Text>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Добавить в корзину: ${product.name}`}
              hitSlop={8}
              onPress={() => addItem(product)}
              style={({ pressed }) => [
                styles.add,
                { backgroundColor: colors.tint, opacity: pressed ? 0.6 : 1 },
              ]}>
              <Icon name="plus" size={16} color={colors.primary} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  link: { gap: Spacing.sm },
  image: { width: '100%', aspectRatio: 1.15, borderRadius: Radius.md },
  body: { gap: 2, paddingHorizontal: Spacing.xs },
  // Две строки названия всегда, чтобы цены в ряду стояли на одной линии.
  name: { minHeight: 40 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 40,
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  price: { flex: 1 },
  add: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
