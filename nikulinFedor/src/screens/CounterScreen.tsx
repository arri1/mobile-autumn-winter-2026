import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import Icon from '../components/Icon';
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
          <Pressable accessibilityRole="button" accessibilityLabel="Уменьшить" onPress={() => setCount((value) => Math.max(0, value - 1))} style={[courseStyles.button, styles.secondary]}>
            <Text style={[courseStyles.buttonText, styles.secondaryText]}>−</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setCount(0)} style={[courseStyles.button, styles.secondary]}>
            <Text style={[courseStyles.buttonText, styles.secondaryText]}>Сбросить</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Увеличить" onPress={() => setCount((value) => value + 1)} style={courseStyles.button}>
            <Text style={courseStyles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.links}>
        <Link href="/labs/name" style={[courseStyles.card, styles.row]} asChild>
          <Pressable accessibilityRole="link">
            <Text style={courseStyles.heading}>Имя</Text>
            <Icon name="arrow" color={colors.green} size={19} />
          </Pressable>
        </Link>
        <Link href="/labs/timer" style={[courseStyles.card, styles.row]} asChild>
          <Pressable accessibilityRole="link">
            <Text style={courseStyles.heading}>Таймер</Text>
            <Icon name="arrow" color={colors.green} size={19} />
          </Pressable>
        </Link>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  counter: { alignItems: 'center', paddingVertical: 24 },
  value: { color: colors.green, fontSize: 64, fontWeight: '800', fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  secondary: { backgroundColor: colors.mint },
  secondaryText: { color: colors.green },
  links: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
