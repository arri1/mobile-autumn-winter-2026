import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

type CardProps = ViewProps & {
  /** false — без внутренних отступов: для списков строк и медиа на всю ширину. */
  padded?: boolean;
};

export function Card({ style, padded = true, ...rest }: CardProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: colors.background, borderColor: colors.border },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  padded: { padding: Spacing.lg, gap: Spacing.md },
});
