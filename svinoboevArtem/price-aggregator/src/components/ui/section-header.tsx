import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/theme';

import { Text } from './text';

type SectionHeaderProps = {
  title: string;
  /** Короткая пометка справа: счётчик, единицы измерения. */
  note?: string | null;
  action?: ReactNode;
};

export function SectionHeader({ title, note, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="heading" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {note ? (
        <Text variant="caption" color="textSecondary">
          {note}
        </Text>
      ) : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  title: { flex: 1 },
});
