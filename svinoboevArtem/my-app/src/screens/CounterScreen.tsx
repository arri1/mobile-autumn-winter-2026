import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components';
import { colors } from '../theme';

// Лаба useState: старт 0, «−» не ниже 0, Reset → 0. Спека: SPECS/lab-usestate.md
export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Счётчик</Text>
      <Text style={styles.value} accessibilityLabel={`Значение: ${count}`}>
        {count}
      </Text>

      <View style={styles.row}>
        {/* функциональный апдейт: берём актуальное значение, а не замкнутое */}
        <Button
          title="−"
          variant="secondary"
          disabled={count === 0}
          onPress={() => setCount((c) => Math.max(0, c - 1))}
        />
        <Button title="Reset" variant="secondary" onPress={() => setCount(0)} />
        <Button title="+" onPress={() => setCount((c) => c + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  title: { fontSize: 20, color: colors.textSecondary, marginBottom: 8 },
  value: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    fontVariant: ['tabular-nums'],
  },
  row: { flexDirection: 'row', gap: 12 },
});
