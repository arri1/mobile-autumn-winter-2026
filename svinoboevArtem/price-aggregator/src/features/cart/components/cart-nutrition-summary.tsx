import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { SectionHeader } from '@/components/ui/section-header';
import { NutritionTable } from '@/features/catalog/components/nutrition-table';
import { plural } from '@/lib/format';
import { Spacing } from '@/theme';

import { useCartStore } from '../cart-store';
import { calculateCartNutrition, checkNutritionLimits, describeViolation } from '../nutrition';
import { NutritionLimitsEditor } from './nutrition-limits-editor';

/** Итоговое КБЖУ корзины, лимиты и предупреждения об их нарушении (ТЗ, п. 4.6.2). */
export function CartNutritionSummary() {
  const items = useCartStore((state) => state.items);
  const limits = useCartStore((state) => state.limits);
  const [editing, setEditing] = useState(false);
  const { totals, unknownItems } = calculateCartNutrition(items);
  const violations = checkNutritionLimits(totals, limits);

  return (
    <Card>
      <SectionHeader
        title="КБЖУ корзины"
        action={
          <Button
            title={editing ? 'Готово' : limits.length > 0 ? `Лимиты: ${limits.length}` : 'Лимиты'}
            variant={editing ? 'primary' : 'soft'}
            size="sm"
            onPress={() => setEditing((value) => !value)}
          />
        }
      />
      <NutritionTable
        nutrition={totals}
        highlighted={violations.map((violation) => violation.nutrient)}
      />
      {editing ? <NutritionLimitsEditor /> : null}
      {violations.length > 0 ? (
        <View style={styles.notices}>
          {violations.map((violation) => (
            <Notice
              key={`${violation.nutrient}-${violation.kind}`}
              tone="warning"
              text={describeViolation(violation)}
            />
          ))}
        </View>
      ) : null}
      {unknownItems > 0 ? (
        <Notice
          text={`Без данных о пищевой ценности: ${unknownItems} ${plural(unknownItems, ['позиция', 'позиции', 'позиций'])} — в сумму не входят.`}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  notices: { gap: Spacing.sm },
});
