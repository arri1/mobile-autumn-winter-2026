import { StyleSheet, View } from 'react-native';

import { StatTile } from '@/components/ui/stat-tile';
import { Spacing } from '@/theme';

import { NUTRIENTS } from '../constants';
import type { Nutrient, Nutrition } from '../types';

type NutritionTableProps = {
  nutrition: Nutrition;
  /** Нутриенты, по которым нарушен лимит, — подсвечиваются. */
  highlighted?: readonly Nutrient[];
};

/** КБЖУ четырьмя плитками в ряд. */
export function NutritionTable({ nutrition, highlighted = [] }: NutritionTableProps) {
  return (
    <View style={styles.row}>
      {(Object.keys(NUTRIENTS) as Nutrient[]).map((nutrient) => (
        <StatTile
          key={nutrient}
          value={formatAmount(nutrition[nutrient])}
          label={NUTRIENTS[nutrient].short}
          tone={highlighted.includes(nutrient) ? 'warning' : 'default'}
        />
      ))}
    </View>
  );
}

function formatAmount(value: number): string {
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return String(rounded).replace('.', ',');
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm },
});
