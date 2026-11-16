import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>УЧЕБНЫЙ ЭКРАН</Text>
      <Text style={styles.title}>Счётчик</Text>
      <View style={styles.valueCard}>
        <Text style={styles.valueLabel}>Текущее значение</Text>
        <Text style={styles.value} accessibilityLiveRegion="polite">{count}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="Уменьшить на один" onPress={() => setCount((current) => Math.max(0, current - 1))} style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>−</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setCount(0)} style={({ pressed }) => [styles.button, styles.resetButton, pressed && styles.pressed]}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Увеличить на один" onPress={() => setCount((current) => current + 1)} style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>Счётчик начинается с нуля и не уходит в минус.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f5ee', padding: 24 },
  eyebrow: { color: '#176b57', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#202b26', fontSize: 28, fontWeight: '800', marginBottom: 24 },
  valueCard: { width: '100%', maxWidth: 340, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fffefa', borderRadius: 26, borderWidth: 1, borderColor: '#e9e7df', paddingVertical: 30, marginBottom: 20 },
  valueLabel: { color: '#68716b', fontSize: 14, marginBottom: 8 },
  value: { color: '#202b26', fontSize: 72, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10 },
  button: { minWidth: 64, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  secondaryButton: { backgroundColor: '#e7edcf' },
  secondaryButtonText: { color: '#176b57', fontSize: 27, fontWeight: '700' },
  resetButton: { backgroundColor: '#fffefa', borderWidth: 1, borderColor: '#e9e7df' },
  resetButtonText: { color: '#202b26', fontSize: 15, fontWeight: '700' },
  primaryButton: { backgroundColor: '#176b57' },
  primaryButtonText: { color: '#fffefa', fontSize: 27, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  hint: { maxWidth: 290, color: '#8a908a', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 18 },
});
