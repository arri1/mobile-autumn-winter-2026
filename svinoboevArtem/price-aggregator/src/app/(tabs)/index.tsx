import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SearchBar } from '@/components/ui/search-bar';
import { Text } from '@/components/ui/text';
import { useCityStore } from '@/features/city/city-store';
import { StoreMap } from '@/features/stores/components/store-map';
import { StorePreviewCard } from '@/features/stores/components/store-preview-card';
import { StoreTypeFilter } from '@/features/stores/components/store-type-filter';
import { useStores } from '@/features/stores/hooks';
import type { StoreType } from '@/features/stores/types';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/hooks/use-theme';
import { Elevation, Radius, Spacing } from '@/theme';

// Обзор европейской части России, пока город не выбран.
const FALLBACK_CENTER = { lat: 55.7558, lon: 37.6173 };

/** Главный экран: полноэкранная карта OSM, поиск и быстрые фильтры (ТЗ, п. 5.2.1). */
export default function MapScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const city = useCityStore((state) => state.city);
  const [types, setTypes] = useState<StoreType[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const debouncedSearch = useDebouncedValue(search.trim());
  const stores = useStores(city ? { cityId: city.id, types, search: debouncedSearch } : null);
  // Магазин мог исчезнуть из выдачи после смены фильтров — тогда карточку не показываем.
  const selected = stores.data?.find((store) => store.id === selectedId) ?? null;
  // Внутри нативных табов нижний safe area уже включает высоту таб-бара.
  const bottomInset = insets.bottom + Spacing.lg;
  const hasPanel = !city || selected !== null;

  return (
    <View style={styles.container}>
      <StoreMap
        // Новый key пересоздаёт карту, чтобы камера встала в центр нового города.
        key={city?.id ?? 'fallback'}
        center={city?.center ?? FALLBACK_CENTER}
        zoom={city ? 11.5 : 4}
        stores={stores.data ?? []}
        selectedStoreId={selected?.id ?? null}
        onStorePress={setSelectedId}
        onBackgroundPress={() => setSelectedId(null)}
        controlsBottomInset={bottomInset + (hasPanel ? panelHeight + Spacing.md : 0)}
      />

      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="box-none">
          <SearchBar
            floating
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск магазинов"
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Сканировать чек или штрихкод"
                hitSlop={10}
                onPress={() => router.push('/scanner')}
                style={[styles.scan, { backgroundColor: colors.tint }]}>
                <Icon name="scan" size={20} color={colors.primary} />
              </Pressable>
            }
          />
        </View>

        <View style={styles.filters} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Город: ${city?.name ?? 'не выбран'}. Изменить`}
            onPress={() => router.push('/city')}
            style={({ pressed }) => [
              styles.cityPill,
              Elevation,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}>
            <Icon name="pin" size={14} color={colors.onPrimary} />
            <Text variant="overline" color="onPrimary" style={styles.cityName} numberOfLines={1}>
              {city?.name ?? 'Город'}
            </Text>
          </Pressable>
          <StoreTypeFilter value={types} onChange={setTypes} />
        </View>
      </SafeAreaView>

      {hasPanel ? (
        <View
          style={[styles.panel, { bottom: bottomInset }]}
          onLayout={(event) => setPanelHeight(event.nativeEvent.layout.height)}>
          {selected ? (
            <StorePreviewCard store={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <View
              style={[
                styles.cityCard,
                Elevation,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}>
              <Text variant="heading">С какого города начнём?</Text>
              <Text color="textSecondary">
                Магазины, цены и маршруты показываются в пределах выбранного города.
              </Text>
              <Button title="Выбрать город" icon="pin" onPress={() => router.push('/city')} />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, gap: Spacing.sm },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  scan: {
    width: 36,
    height: 36,
    marginRight: -Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', alignItems: 'center' },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 36,
    maxWidth: 150,
    marginLeft: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  cityName: { fontSize: 13, lineHeight: 18, flexShrink: 1 },
  panel: { position: 'absolute', left: Spacing.lg, right: Spacing.lg },
  cityCard: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
