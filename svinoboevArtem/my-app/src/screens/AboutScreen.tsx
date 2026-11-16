import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const LABS = [
  'Пара 2 — Welcome + Bottom Tabs',
  'Пара 3 — useState: счётчик',
  'Пара 3 — controlled TextInput',
  'Пара 3 — useEffect: таймер и фейковая загрузка',
  'Пара 3 — список постов и просмотр поста (GET)',
  'Дополнительно — создание, редактирование и удаление своих постов',
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>Свинобоев Артем Альбертович</Text>
        <Text style={styles.meta}>Группа ИВТ-23-2 · СВФУ</Text>
        <Text style={styles.meta}>batteryofsprunk@gmail.com</Text>
      </View>

      <Text style={styles.section}>Что сделано</Text>
      {LABS.map((lab) => (
        <Text key={lab} style={styles.item}>
          ✓ {lab}
        </Text>
      ))}

      <Text style={styles.section}>Стек</Text>
      <Text style={styles.item}>
        Expo SDK 57, React Native 0.86, TypeScript, React Navigation 7 (Bottom Tabs + Native
        Stack), fetch.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, gap: 4 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  meta: { fontSize: 15, color: colors.textSecondary },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 16 },
  item: { fontSize: 15, lineHeight: 22, color: colors.text },
});
