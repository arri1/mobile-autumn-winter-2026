import type { ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Elevation, Fonts, Radius, Spacing } from '@/theme';

import { Icon } from './icon';

type SearchBarProps = Pick<
  TextInputProps,
  'placeholder' | 'keyboardType' | 'autoFocus' | 'onSubmitEditing'
> & {
  value: string;
  onChangeText: (value: string) => void;
  /** Элемент справа — например, кнопка сканера. */
  right?: ReactNode;
  /** Плавающий вариант с тенью — поверх карты. */
  floating?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  right,
  floating = false,
  ...input
}: SearchBarProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.background, borderColor: colors.border },
        floating && Elevation,
      ]}>
      <Icon name="search" size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={input.placeholder}
        style={[styles.input, { color: colors.text }]}
        {...input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Очистить поиск"
          hitSlop={10}
          onPress={() => onChangeText('')}>
          <Icon name="clearField" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, height: '100%', fontFamily: Fonts.semibold, fontSize: 16 },
});
