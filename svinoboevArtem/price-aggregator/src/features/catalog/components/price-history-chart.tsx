import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { formatDayMonth, formatPrice } from '@/lib/format';
import { Spacing } from '@/theme';

import { priceChange, toChartPoints } from '../price-history';
import type { PricePoint } from '../types';

const HEIGHT = 120;
const DOT = 9;
const LINE = 3;
// Поля, чтобы крайние точки не обрезались.
const INSET = 8;

/** График минимальной цены по городу. Рисуется обычными View — без SVG-зависимости. */
export function PriceHistoryChart({ history }: { history: readonly PricePoint[] }) {
  const colors = useTheme();
  const [width, setWidth] = useState(0);
  const points = toChartPoints(history).map((point) => ({
    ...point,
    left: INSET + point.x * Math.max(0, width - INSET * 2),
    top: INSET + (1 - point.y) * (HEIGHT - INSET * 2),
  }));
  const change = priceChange(history);
  const prices = history.map((point) => point.price);

  return (
    <View style={styles.container}>
      <View
        style={styles.plot}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        accessibilityRole="image"
        accessibilityLabel={`Минимальная цена менялась от ${formatPrice(Math.min(...prices))} до ${formatPrice(Math.max(...prices))}`}>
        {[0, 0.5, 1].map((level) => (
          <View
            key={level}
            style={[
              styles.gridLine,
              { top: INSET + level * (HEIGHT - INSET * 2), backgroundColor: colors.border },
            ]}
          />
        ))}
        {width > 0
          ? points.slice(1).map((point, index) => {
              const previous = points[index];
              const dx = point.left - previous.left;
              const dy = point.top - previous.top;
              const length = Math.hypot(dx, dy);
              return (
                <View
                  key={point.date}
                  style={[
                    styles.segment,
                    {
                      width: length,
                      // Отрезок позиционируется центром и поворачивается вокруг него.
                      left: (previous.left + point.left) / 2 - length / 2,
                      top: (previous.top + point.top) / 2 - LINE / 2,
                      backgroundColor: colors.primary,
                      transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
                    },
                  ]}
                />
              );
            })
          : null}
        {width > 0
          ? points.map((point) => (
              <View
                key={point.date}
                style={[
                  styles.dot,
                  {
                    left: point.left - DOT / 2,
                    top: point.top - DOT / 2,
                    backgroundColor: colors.primary,
                    borderColor: colors.background,
                  },
                ]}
              />
            ))
          : null}
      </View>

      <View style={styles.axis}>
        <Text variant="overline" color="textSecondary">
          {formatDayMonth(history[0].date)}
        </Text>
        {change !== null && change !== 0 ? (
          <Text variant="overline" color={change < 0 ? 'primary' : 'warning'}>
            {change < 0 ? '↓' : '↑'} {formatPrice(Math.abs(change))} за период
          </Text>
        ) : null}
        <Text variant="overline" color="textSecondary">
          {formatDayMonth(history[history.length - 1].date)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  plot: { height: HEIGHT },
  gridLine: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth },
  segment: { position: 'absolute', height: LINE, borderRadius: LINE / 2 },
  dot: { position: 'absolute', width: DOT, height: DOT, borderRadius: DOT / 2, borderWidth: 1.5 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
