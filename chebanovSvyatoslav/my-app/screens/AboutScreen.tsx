import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Обо мне</Text>
      <Text style={styles.text}>ФИО: Чебанов Святослав Сергеевич</Text>
      <Text style={styles.text}>Группа: ИВТ-23-2</Text>
      <Text style={styles.text}>Проект: Expo + TypeScript</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 4 },
});