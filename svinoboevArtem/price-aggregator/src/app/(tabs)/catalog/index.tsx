import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/status-views';
import { CategoryList } from '@/features/catalog/components/category-list';
import { ProductGrid } from '@/features/catalog/components/product-grid';
import { useCategories, useProducts } from '@/features/catalog/hooks';
import { useCityStore } from '@/features/city/city-store';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useRefresh } from '@/hooks/use-refresh';
import { useTheme } from '@/hooks/use-theme';
import { plural } from '@/lib/format';
import { Spacing } from '@/theme';

/** Каталог: поиск по названию и штрихкоду, категории и товары города (ТЗ, п. 5.2.3). */
export default function CatalogScreen() {
  const colors = useTheme();
  const city = useCityStore((state) => state.city);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const categories = useCategories(null);
  const products = useProducts({ search: debouncedSearch });
  const refresh = useRefresh(() => Promise.all([categories.refetch(), products.refetch()]));

  if (!city) {
    return (
      <Screen>
        <EmptyView
          icon="pin"
          title="Город не выбран"
          description="Цены и наличие товаров зависят от города."
          action={<Button title="Выбрать город" onPress={() => router.push('/city')} />}
        />
      </Screen>
    );
  }

  const count = products.data?.length ?? 0;

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={refresh.refreshing}
          tintColor={colors.primary}
          onRefresh={refresh.onRefresh}
        />
      }>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Название или штрихкод" />

      {categories.data?.length && !debouncedSearch ? (
        <CategoryList categories={categories.data} />
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title={debouncedSearch ? 'Результаты поиска' : 'Все товары'}
          note={products.data ? `${count} ${plural(count, ['товар', 'товара', 'товаров'])}` : null}
        />
        {products.isPending ? <LoadingView /> : null}
        {products.isError ? (
          <ErrorView error={products.error} onRetry={() => products.refetch()} />
        ) : null}
        {products.data && count === 0 ? (
          <EmptyView
            icon="search"
            title={debouncedSearch ? 'Ничего не нашлось' : 'Каталог пока пуст'}
            description={
              debouncedSearch ? `По запросу «${debouncedSearch}» товаров нет.` : undefined
            }
          />
        ) : null}
        {products.data ? <ProductGrid products={products.data} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { flexGrow: 1, gap: Spacing.md },
});
