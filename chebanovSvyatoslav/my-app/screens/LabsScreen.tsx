import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LabsScreen() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);

  const decrement = () => setCount((c) => (c > 0 ? c - 1 : 0));

  const reset = () => setCount(0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Счётчик</Text>

      <Text style={styles.counter}>{count}</Text>

      <View style={styles.row}>
        <Pressable
          onPress={decrement}
          style={({ pressed }) => [
            styles.button,
            styles.minus,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>

        <Pressable
          onPress={increment}
          style={({ pressed }) => [
            styles.button,
            styles.plus,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={reset}
        style={({ pressed }) => [
          styles.button,
          styles.reset,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
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
  label: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  counter: {
    fontSize: 96,
    fontWeight: '700',
    color: '#222',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    minWidth: 80,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    backgroundColor: '#e74c3c',
  },
  plus: {
    backgroundColor: '#2ecc71',
  },
  reset: {
    backgroundColor: '#3498db',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});