import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/status-views';
import { useCityStore } from '@/features/city/city-store';
import { StoreListItem } from '@/features/stores/components/store-list-item';
import { StoreTypeFilter } from '@/features/stores/components/store-type-filter';
import { STORE_SORT_LABELS } from '@/features/stores/constants';
import { useStores } from '@/features/stores/hooks';
import type { StoreSort, StoreType } from '@/features/stores/types';
import { useCurrentPoint } from '@/hooks/use-current-point';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useRefresh } from '@/hooks/use-refresh';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme';

const SORTS = Object.keys(STORE_SORT_LABELS) as StoreSort[];

/** Список магазинов города: поиск, типы, сортировка по рейтингу, расстоянию и ценам (ТЗ, п. 5.2.2). */
export default function StoresScreen() {
  const colors = useTheme();
  const city = useCityStore((state) => state.city);
  const [sort, setSort] = useState<StoreSort>('rating');
  const [types, setTypes] = useState<StoreType[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const location = useCurrentPoint(sort === 'distance');
  // Для сортировки «Рядом» сначала нужны координаты пользователя.
  const waitingForLocation = sort === 'distance' && !location.data;
  const params =
    city && !waitingForLocation
      ? { cityId: city.id, sort, types, search: debouncedSearch, near: location.data ?? null }
      : null;
  const stores = useStores(params);
  const refresh = useRefresh(() => stores.refetch());

  if (!city) {
    return (
      <Screen>
        <EmptyView
          icon="pin"
          title="Город не выбран"
          description="Выберите город, чтобы увидеть магазины."
          action={<Button title="Выбрать город" onPress={() => router.push('/city')} />}
        />
      </Screen>
    );
  }

  function renderEmpty() {
    if (sort === 'distance' && location.isError) {
      return <ErrorView error={location.error} onRetry={() => location.refetch()} />;
    }
    if (stores.isError) return <ErrorView error={stores.error} onRetry={() => stores.refetch()} />;
    if (stores.isPending) return <LoadingView />;
    return (
      <EmptyView
        icon="store"
        title="Магазины не найдены"
        description="Попробуйте изменить запрос или снять фильтры."
      />
    );
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={{ backgroundColor: colors.canvas }}
      contentContainerStyle={styles.content}
      // Пока ждём геопозицию, прошлый список не показываем: он отсортирован иначе.
      data={waitingForLocation ? [] : (stores.data ?? [])}
      keyExtractor={(store) => store.id}
      renderItem={({ item }) => (
        <StoreListItem
          store={item}
          onPress={() =>
            router.push({ pathname: '/stores/[storeId]', params: { storeId: item.id } })
          }
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Название или сеть" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bleed}
            contentContainerStyle={styles.sorts}>
            {SORTS.map((item) => (
              <Chip
                key={item}
                label={STORE_SORT_LABELS[item]}
                icon={item === 'distance' ? 'location' : item === 'rating' ? 'star' : 'tag'}
                selected={item === sort}
                onPress={() => setSort(item)}
              />
            ))}
          </ScrollView>
          <StoreTypeFilter value={types} onChange={setTypes} bleed />
        </View>
      }
      ListEmptyComponent={renderEmpty()}
      refreshControl={
        <RefreshControl
          refreshing={refresh.refreshing}
          tintColor={colors.primary}
          // refetch() выполняет запрос даже при enabled: false, поэтому без параметров не обновляем.
          onRefresh={params ? refresh.onRefresh : undefined}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
  header: { gap: Spacing.md, marginBottom: Spacing.xs },
  bleed: { flexGrow: 0, marginHorizontal: -Spacing.lg },
  sorts: { gap: Spacing.sm, paddingHorizontal: Spacing.lg },
});
