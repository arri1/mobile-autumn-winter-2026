import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/theme';

import { STORE_TYPE_LABELS, STORE_TYPES } from '../constants';
import type { StoreType } from '../types';

type StoreTypeFilterProps = {
  value: StoreType[];
  onChange: (value: StoreType[]) => void;
  /** Отрицательный отступ, если лента стоит внутри контейнера с боковыми полями. */
  bleed?: boolean;
};

/** Быстрые фильтры по видам магазинов (ТЗ, п. 5.2.1). */
export function StoreTypeFilter({ value, onChange, bleed = false }: StoreTypeFilterProps) {
  function toggle(type: StoreType) {
    onChange(value.includes(type) ? value.filter((item) => item !== type) : [...value, type]);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll, bleed && styles.bleed]}
      contentContainerStyle={styles.row}>
      {STORE_TYPES.map((type) => (
        <Chip
          key={type}
          label={STORE_TYPE_LABELS[type]}
          selected={value.includes(type)}
          onPress={() => toggle(type)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Без flexGrow: 0 горизонтальный ScrollView в колонке растягивается на всю высоту.
  scroll: { flexGrow: 0 },
  bleed: { marginHorizontal: -Spacing.lg },
  row: { alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
});
