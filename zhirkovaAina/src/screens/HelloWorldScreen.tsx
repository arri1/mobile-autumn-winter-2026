import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function HelloWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Lab 0</Text>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>React Native · Expo · TypeScript</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});