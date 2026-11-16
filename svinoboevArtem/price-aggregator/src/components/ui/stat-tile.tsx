import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

import { Text } from './text';

type StatTileProps = {
  value: string;
  label: string;
  tone?: 'default' | 'warning';
};

/** Плитка «значение + подпись»: КБЖУ, итоги маршрута. */
export function StatTile({ value, label, tone = 'default' }: StatTileProps) {
  const colors = useTheme();
  const warning = tone === 'warning';
  return (
    <View style={[styles.tile, { backgroundColor: warning ? colors.warm : colors.surface }]}>
      <Text
        variant="heading"
        color={warning ? 'warning' : 'text'}
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.value}>
        {value}
      </Text>
      <Text variant="overline" color={warning ? 'warning' : 'textSecondary'} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 70,
    gap: 2,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  value: { fontVariant: ['tabular-nums'] },
});
