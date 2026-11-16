import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Fonts, type ThemeColor } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption' | 'overline';

export type TextProps = RNTextProps & {
  variant?: Variant;
  color?: ThemeColor;
};

export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const colors = useTheme();
  return <RNText style={[styles[variant], { color: colors[color] }, style]} {...rest} />;
}

// Вес задаётся семейством шрифта: у Manrope каждое начертание — отдельный файл.
const styles = StyleSheet.create({
  display: { fontFamily: Fonts.extrabold, fontSize: 30, lineHeight: 36, letterSpacing: -0.8 },
  title: { fontFamily: Fonts.extrabold, fontSize: 24, lineHeight: 30, letterSpacing: -0.5 },
  heading: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: Fonts.bold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: Fonts.semibold, fontSize: 12, lineHeight: 16 },
});
