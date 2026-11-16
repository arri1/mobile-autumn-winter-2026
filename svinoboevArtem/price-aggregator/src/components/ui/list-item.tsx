import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type ListItemProps = {
  title: string;
  subtitle?: string | null;
  icon?: IconName;
  right?: ReactNode;
  onPress?: () => void;
  /** Разделитель снизу; у последней строки в карточке его убирают. */
  divider?: boolean;
};

/** Строка списка; рассчитана на размещение внутри `<Card padded={false}>`. */
export function ListItem({ title, subtitle, icon, right, onPress, divider = true }: ListItemProps) {
  const colors = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.surface : 'transparent' },
      ]}>
      {icon ? (
        <View style={[styles.iconBadge, { backgroundColor: colors.tint }]}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
      ) : null}
      <View
        style={[
          styles.content,
          divider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
          },
        ]}>
        <View style={styles.body}>
          <Text variant="label" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
        {onPress ? <Icon name="chevronRight" size={13} color={colors.textSecondary} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingLeft: Spacing.lg,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 60,
    paddingVertical: Spacing.md,
    paddingRight: Spacing.lg,
  },
  body: { flex: 1, gap: 2 },
});
