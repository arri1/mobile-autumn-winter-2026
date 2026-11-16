import { StyleSheet } from 'react-native';

import { colors } from '../theme';

export const courseStyles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', color: colors.ink },
  heading: { fontSize: 20, fontWeight: '700', color: colors.ink },
  text: { fontSize: 16, lineHeight: 23, color: colors.ink },
  muted: { fontSize: 14, lineHeight: 20, color: colors.muted },
  card: { gap: 12, padding: 16, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 18 },
  button: { minHeight: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, backgroundColor: colors.green, borderRadius: 12 },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.paper },
  link: { minHeight: 44, paddingVertical: 12, fontSize: 16, fontWeight: '700', color: colors.green },
});
