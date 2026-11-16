import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type Tone = 'info' | 'warning' | 'danger' | 'success';

type NoticeProps = {
  text: string;
  tone?: Tone;
};

const ICONS: Record<Tone, IconName> = {
  info: 'info',
  warning: 'warning',
  danger: 'warning',
  success: 'check',
};

/** Строка-уведомление внутри карточки: ошибка действия, предупреждение, подсказка. */
export function Notice({ text, tone = 'info' }: NoticeProps) {
  const colors = useTheme();
  const palette = {
    info: { background: colors.surface, foreground: colors.textSecondary },
    warning: { background: colors.warm, foreground: colors.warning },
    danger: { background: colors.dangerTint, foreground: colors.danger },
    success: { background: colors.tint, foreground: colors.primary },
  }[tone];

  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      style={[styles.notice, { backgroundColor: palette.background }]}>
      <Icon name={ICONS[tone]} size={16} color={palette.foreground} />
      <Text variant="caption" style={[styles.text, { color: palette.foreground }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  text: { flex: 1 },
});
