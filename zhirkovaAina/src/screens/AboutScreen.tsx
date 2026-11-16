import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>О приложении</Text>
      <Text style={styles.subtitle}>Учебный проект курса мобильной разработки, СВФУ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});