import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Андреева Анастасия Тимуровна</Text>
      <Text style={styles.subtitle}>ФИИТ-23</Text>
      <Text style={styles.caption}>Мобильная разработка · СВФУ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: '#888',
  },
});
