import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'md' | 'lg';
};

/** Счётчик количества. При значении 1 «минус» превращается в удаление (onChange(0)). */
export function Stepper({ value, onChange, max = 999, size = 'md' }: StepperProps) {
  const colors = useTheme();
  const side = size === 'lg' ? 44 : 36;

  function renderButton(icon: IconName, label: string, next: number, disabled = false) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        hitSlop={6}
        onPress={() => onChange(next)}
        style={({ pressed }) => [
          styles.button,
          { width: side, height: side, opacity: disabled ? 0.35 : pressed ? 0.6 : 1 },
        ]}>
        <Icon name={icon} size={15} color={colors.primary} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.tint }]}>
      {value > 1
        ? renderButton('minus', 'Уменьшить количество', value - 1)
        : renderButton('trash', 'Убрать из корзины', 0)}
      <Text variant="label" style={styles.value} accessibilityLabel={`Количество: ${value}`}>
        {value}
      </Text>
      {renderButton('plus', 'Увеличить количество', value + 1, value >= max)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md },
  button: { alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 22, textAlign: 'center', fontVariant: ['tabular-nums'] },
});
