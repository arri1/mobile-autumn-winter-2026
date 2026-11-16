import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{count}</Text>

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => setCount((c) => Math.max(0, c - 1))}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => setCount(0)}>
          <Text style={styles.btnText}>Сброс</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => setCount((c) => c + 1)}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  value: {
    fontSize: 64,
    fontWeight: '700',
    marginBottom: 24,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    backgroundColor: colors.card,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '600',
  },
});