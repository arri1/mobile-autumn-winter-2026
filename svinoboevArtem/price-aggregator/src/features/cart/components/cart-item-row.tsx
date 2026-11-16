import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Stepper } from '@/components/ui/stepper';
import { Text } from '@/components/ui/text';
import { ProductImage } from '@/features/catalog/components/product-image';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice, formatWeight } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

import { useCartStore } from '../cart-store';
import type { CartItem } from '../types';

type CartItemRowProps = {
  item: CartItem;
  divider?: boolean;
};

export function CartItemRow({ item, divider = true }: CartItemRowProps) {
  const colors = useTheme();
  const setQuantity = useCartStore((state) => state.setQuantity);
  const { product, quantity } = item;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Открыть товар: ${product.name}`}
        onPress={() =>
          router.push({
            pathname: '/catalog/product/[productId]',
            params: { productId: product.id },
          })
        }>
        <ProductImage product={product} style={styles.image} iconSize={20} />
      </Pressable>
      <View
        style={[
          styles.content,
          divider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
          },
        ]}>
        <View style={styles.body}>
          <Text variant="label" numberOfLines={2}>
            {product.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {[
              product.net_weight ? formatWeight(product.net_weight) : null,
              product.min_price !== null
                ? `от ${formatPrice(product.min_price * quantity)}`
                : 'нет цены',
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        <Stepper value={quantity} onChange={(next) => setQuantity(product.id, next)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingLeft: Spacing.md },
  image: { width: 52, height: 52, borderRadius: Radius.md },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 76,
    paddingVertical: Spacing.md,
    paddingRight: Spacing.md,
  },
  body: { flex: 1, gap: 2 },
});
