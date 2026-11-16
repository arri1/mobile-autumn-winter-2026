import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { NUTRIENTS } from '@/features/catalog/constants';
import type { Nutrient } from '@/features/catalog/types';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Radius, Spacing } from '@/theme';

import { useCartStore } from '../cart-store';
import { updateLimit } from '../nutrition';
import type { NutritionLimit } from '../types';

/** Ограничения КБЖУ для корзины: «не более 2000 ккал», «белки не менее 100 г» (ТЗ, п. 4.6.2). */
export function NutritionLimitsEditor() {
  const limits = useCartStore((state) => state.limits);
  const setLimits = useCartStore((state) => state.setLimits);

  return (
    <View style={styles.list}>
      {(Object.keys(NUTRIENTS) as Nutrient[]).map((nutrient) => (
        <LimitRow
          key={nutrient}
          nutrient={nutrient}
          limit={limits.find((item) => item.nutrient === nutrient)}
          onChange={(patch) => setLimits(updateLimit(limits, nutrient, patch))}
        />
      ))}
    </View>
  );
}

type LimitRowProps = {
  nutrient: Nutrient;
  limit: NutritionLimit | undefined;
  onChange: (patch: Partial<Pick<NutritionLimit, 'kind' | 'value'>> | null) => void;
};

function LimitRow({ nutrient, limit, onChange }: LimitRowProps) {
  const colors = useTheme();
  const { label, unit } = NUTRIENTS[nutrient];
  // Вид лимита живёт в строке: его можно выбрать раньше, чем введено число.
  const [kind, setKind] = useState(limit?.kind ?? 'max');

  function toggleKind() {
    const next = kind === 'max' ? 'min' : 'max';
    setKind(next);
    if (limit) onChange({ kind: next });
  }

  return (
    <View style={styles.row}>
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${kind === 'max' ? 'не более' : 'не менее'}. Переключить`}
        hitSlop={6}
        onPress={toggleKind}
        style={({ pressed }) => [
          styles.kind,
          { backgroundColor: colors.tint, opacity: pressed ? 0.6 : 1 },
        ]}>
        <Text variant="overline" color="primary">
          {kind === 'max' ? 'не более' : 'не менее'}
        </Text>
      </Pressable>
      <TextInput
        accessibilityLabel={`${label}, лимит в ${unit}`}
        value={limit ? String(limit.value) : ''}
        onChangeText={(text) => {
          const value = Number(text.replace(/\D/g, '').slice(0, 5));
          onChange(value > 0 ? { kind, value } : null);
        }}
        placeholder="—"
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        keyboardType="number-pad"
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      />
      <Text variant="caption" color="textSecondary" style={styles.unit}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: { flex: 1 },
  kind: { paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.pill },
  input: {
    width: 76,
    height: 40,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: Fonts.bold,
    fontSize: 15,
    textAlign: 'center',
  },
  unit: { width: 34 },
});
