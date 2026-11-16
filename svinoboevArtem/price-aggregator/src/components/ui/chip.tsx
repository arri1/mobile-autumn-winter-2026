import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type ChipProps = {
  label: string;
  selected?: boolean;
  icon?: IconName;
  onPress?: () => void;
};

export function Chip({ label, selected = false, icon, onPress }: ChipProps) {
  const colors = useTheme();
  const foreground = selected ? colors.primary : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.tint : colors.background,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      {icon ? <Icon name={icon} size={14} color={foreground} /> : null}
      <Text variant="overline" style={[styles.label, { color: foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  label: { fontSize: 13, lineHeight: 18 },
});
