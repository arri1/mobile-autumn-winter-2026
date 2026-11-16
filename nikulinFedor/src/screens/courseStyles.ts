import { StyleSheet } from 'react-native';

import { colors } from '../theme';

export const courseStyles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1.2, color: colors.ink },
  heading: { fontSize: 20, fontWeight: '700', letterSpacing: -0.35, color: colors.ink },
  text: { fontSize: 16, lineHeight: 23, color: colors.ink },
  muted: { fontSize: 14, lineHeight: 20, color: colors.muted },
  card: { gap: 12, padding: 18, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 20 },
  button: { minHeight: 48, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.green, borderRadius: 14 },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.paper },
  iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 14 },
  dimmed: { opacity: 0.55 },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink },
  input: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 14, minHeight: 52, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, lineHeight: 23, color: colors.ink },
  error: { fontSize: 14, lineHeight: 21, color: colors.danger },
  link: { minHeight: 44, paddingVertical: 12, fontSize: 16, fontWeight: '700', color: colors.green },
});
