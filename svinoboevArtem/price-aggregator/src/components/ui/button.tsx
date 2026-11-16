import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type Variant = 'primary' | 'soft' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || loading;
  const palette = {
    primary: { background: colors.primary, foreground: colors.onPrimary },
    soft: { background: colors.tint, foreground: colors.primary },
    secondary: { background: colors.surface, foreground: colors.text },
    ghost: { background: 'transparent', foreground: colors.primary },
    danger: { background: colors.dangerTint, foreground: colors.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        {
          backgroundColor: palette.background,
          opacity: isDisabled ? 0.45 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.foreground} />
      ) : (
        <>
          {icon ? (
            <Icon name={icon} size={size === 'sm' ? 15 : 18} color={palette.foreground} />
          ) : null}
          <Text
            variant={size === 'sm' ? 'caption' : 'label'}
            numberOfLines={1}
            style={[styles.title, { color: palette.foreground }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  md: { minHeight: 50, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg },
  sm: { minHeight: 36, paddingHorizontal: Spacing.md, borderRadius: Radius.md },
  title: { fontFamily: 'Manrope_700Bold', flexShrink: 1 },
});
