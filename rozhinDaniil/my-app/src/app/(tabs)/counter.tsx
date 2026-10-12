import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  // Не даём счётчику уйти ниже нуля
  const decrement = () => setCount((prev) => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  const canDecrement = count > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.row}>
        <Pressable
          onPress={decrement}
          disabled={!canDecrement}
          style={({ pressed }) => [
            styles.button,
            !canDecrement && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Уменьшить"
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>

        <Pressable
          onPress={increment}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Увеличить"
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={reset}
        style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
        accessibilityRole="button"
      >
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  count: {
    fontSize: 72,
    fontWeight: '700',
    color: '#111',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4630EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#C9C3F5',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4630EB',
  },
  resetText: {
    color: '#4630EB',
    fontSize: 17,
    fontWeight: '600',
  },
});
