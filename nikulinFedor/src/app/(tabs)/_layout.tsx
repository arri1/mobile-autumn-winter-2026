import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '../../components/Icon';
import { colors } from '../../theme';

const tabs = [
  { route: 'index', title: 'Главная', icon: 'home' },
  { route: 'campus', title: 'Кампус', icon: 'campus' },
  { route: 'labs', title: 'Лабы', icon: 'labs' },
  { route: 'posts', title: 'Посты', icon: 'posts' },
  { route: 'profile', title: 'Профиль', icon: 'profile' },
] as const;

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.green,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: styles.label,
      tabBarStyle: [styles.bar, { height: 58 + bottom }],
    }}>
      {tabs.map(({ route, title, icon }) => (
        <Tabs.Screen key={route} name={route} options={{
          title,
          tabBarAccessibilityLabel: title,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.icon, focused && styles.active]}>
              <Icon name={icon} color={color} size={20} />
            </View>
          ),
        }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.paper, borderTopColor: colors.line },
  label: { fontSize: 11, fontWeight: '600' },
  icon: { width: 42, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.mint },
});
