import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <CampusScreen>
      <Text accessibilityRole="header" style={courseStyles.title}>Лабораторные</Text>
      <View style={[courseStyles.card, styles.counter]}>
        <Text accessibilityRole="header" style={courseStyles.heading}>Счётчик</Text>
        <Text accessibilityLabel={`Значение счётчика ${count}`} accessibilityLiveRegion="polite" style={styles.value}>{count}</Text>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel="Уменьшить" onPress={() => setCount((value) => Math.max(0, value - 1))} style={courseStyles.button}>
            <Text style={courseStyles.buttonText}>−</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setCount(0)} style={courseStyles.button}>
            <Text style={courseStyles.buttonText}>Сбросить</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Увеличить" onPress={() => setCount((value) => value + 1)} style={courseStyles.button}>
            <Text style={courseStyles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={courseStyles.card}>
        <Link href="/labs/name" style={courseStyles.link}>Имя · TextInput →</Link>
        <Link href="/labs/timer" style={courseStyles.link}>Таймер · useEffect →</Link>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  counter: { alignItems: 'center' },
  value: { color: colors.green, fontSize: 60, fontWeight: '800' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
});
