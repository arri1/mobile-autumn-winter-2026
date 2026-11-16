import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Fonts, Radius, Spacing } from '@/theme';

import { Text } from './text';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string | null;
};

export function TextField({ label, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.container}>
      {label ? (
        <Text variant="overline" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        accessibilityLabel={label}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.background, borderColor },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
});
