import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Item = { id: string; title: string };

// Лаба useEffect, оба варианта из задания. Спека: SPECS/lab-useeffect.md
export default function TimerScreen() {
  // Вариант 1: секунды с момента открытия экрана.
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    // cleanup: без него интервал продолжит тикать после размонтирования экрана
    return () => clearInterval(id);
  }, []);

  // Вариант 2: «загрузка» через setTimeout → три фейковых пункта.
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      setItems([
        { id: '1', title: 'Первый пункт' },
        { id: '2', title: 'Второй пункт' },
        { id: '3', title: 'Третий пункт' },
      ]);
      setLoading(false);
    }, 1500);
    // если уйти с экрана раньше 1,5 с, setState не вызовется на размонтированном компоненте
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Секунд на экране</Text>
        <Text style={styles.value}>{seconds}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Фейковая загрузка</Text>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.hint}>Загрузка…</Text>
          </View>
        ) : (
          items.map((item) => (
            <Text key={item.id} style={styles.item}>
              • {item.title}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: colors.background,
  },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20 },
  label: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  value: { fontSize: 48, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hint: { color: colors.textSecondary },
  item: { fontSize: 18, color: colors.text, marginVertical: 4 },
});
