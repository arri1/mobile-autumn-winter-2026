import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { colors } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.green,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Главная', tabBarAccessibilityLabel: 'Главная', tabBarIcon: ({ color }) => <Text aria-hidden style={{ color, fontSize: 20 }}>⌂</Text> }} />
      <Tabs.Screen name="campus" options={{ title: 'Кампус', tabBarAccessibilityLabel: 'Кампус', tabBarIcon: ({ color }) => <Text aria-hidden style={{ color, fontSize: 20 }}>◇</Text> }} />
      <Tabs.Screen name="labs" options={{ title: 'Лабы', tabBarAccessibilityLabel: 'Лабы', tabBarIcon: ({ color }) => <Text aria-hidden style={{ color, fontSize: 20 }}>±</Text> }} />
      <Tabs.Screen name="posts" options={{ title: 'Посты', tabBarAccessibilityLabel: 'Посты', tabBarIcon: ({ color }) => <Text aria-hidden style={{ color, fontSize: 20 }}>▤</Text> }} />
    </Tabs>
  );
}
