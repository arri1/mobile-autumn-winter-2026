import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/status-views';
import { CategoryList } from '@/features/catalog/components/category-list';
import { ProductGrid } from '@/features/catalog/components/product-grid';
import { useCategories, useProducts } from '@/features/catalog/hooks';
import { useCityStore } from '@/features/city/city-store';
import { plural } from '@/lib/format';
import { Spacing } from '@/theme';

/** Категория: подкатегории лентой и товары вместе со вложенными категориями. */
export default function CategoryScreen() {
  const { categoryId, title } = useLocalSearchParams<{ categoryId: string; title?: string }>();
  const hasCity = useCityStore((state) => state.city !== null);
  const subcategories = useCategories(categoryId);
  const products = useProducts({ categoryId });

  if (!hasCity) {
    return (
      <Screen>
        <Stack.Screen options={{ title: title ?? 'Категория' }} />
        <EmptyView
          icon="pin"
          title="Город не выбран"
          description="Выберите город, чтобы увидеть товары и цены."
          action={<Button title="Выбрать город" onPress={() => router.push('/city')} />}
        />
      </Screen>
    );
  }

  const count = products.data?.length ?? 0;

  return (
    <Screen>
      <Stack.Screen options={{ title: title ?? 'Категория' }} />
      {subcategories.data?.length ? <CategoryList categories={subcategories.data} /> : null}

      <View style={styles.section}>
        <SectionHeader
          title="Товары"
          note={products.data ? `${count} ${plural(count, ['товар', 'товара', 'товаров'])}` : null}
        />
        {products.isPending ? <LoadingView /> : null}
        {products.isError ? (
          <ErrorView error={products.error} onRetry={() => products.refetch()} />
        ) : null}
        {products.data && count === 0 ? (
          <EmptyView title="Здесь пока ничего нет" description="В этой категории нет товаров." />
        ) : null}
        {products.data ? <ProductGrid products={products.data} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { flexGrow: 1, gap: Spacing.md },
});
