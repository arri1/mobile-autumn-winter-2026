import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/theme';

import type { ProductSummary } from '../types';
import { ProductCard } from './product-card';

/** Сетка в две колонки. Строки собираем вручную: экран уже прокручивается ScrollView. */
export function ProductGrid({ products }: { products: readonly ProductSummary[] }) {
  const rows: ProductSummary[][] = [];
  for (let index = 0; index < products.length; index += 2) {
    rows.push(products.slice(index, index + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  spacer: { flex: 1 },
});
