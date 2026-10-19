import { StyleSheet, Text, View } from 'react-native';

export function AboutScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>M</Text>
        </View>
        <Text style={styles.eyebrow}>О ПРОЕКТЕ</Text>
        <Text style={styles.title}>Мобильная разработка</Text>
        <Text style={styles.description}>
          Учебное приложение курса по созданию мобильных приложений на React
          Native и Expo.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.stackLabel}>ТЕХНОЛОГИИ</Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>React Native</Text>
          <Text style={styles.tag}>Expo</Text>
          <Text style={styles.tag}>TypeScript</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f5ee',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 26,
    backgroundColor: '#fffefa',
    padding: 26,
    borderWidth: 1,
    borderColor: '#e9e7df',
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#176b57',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  brandMarkText: {
    color: '#fffefa',
    fontSize: 24,
    fontWeight: '800',
  },
  eyebrow: {
    color: '#176b57',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: '#202b26',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 12,
  },
  description: {
    color: '#68716b',
    fontSize: 15,
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9e7df',
    marginVertical: 22,
  },
  stackLabel: {
    color: '#8a908a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#eaf1e9',
    color: '#176b57',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
