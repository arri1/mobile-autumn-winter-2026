import type { ReactElement, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** false — для экранов со своим скроллом (FlatList, карта). */
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: ReactElement<RefreshControlProps>;
};

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  refreshControl,
}: ScreenProps) {
  const colors = useTheme();

  if (!scroll) {
    return <View style={[styles.fill, { backgroundColor: colors.canvas }]}>{children}</View>;
  }

  return (
    <ScrollView
      // Нужен для корректного сворачивания large title в iOS-хедере.
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={refreshControl}
      style={{ backgroundColor: colors.canvas }}
      contentContainerStyle={[styles.content, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1, padding: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.lg },
});
