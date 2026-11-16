import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import CounterScreen from './src/screens/CounterScreen';
import HelloWorldScreen from './src/screens/HelloWorldScreen';
import AboutScreen from './src/screens/AboutScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Counter"
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.background,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tab.Screen
          name="Counter"
          component={CounterScreen}
          options={{ title: 'Счётчик' }}
        />
        <Tab.Screen
          name="Labs"
          component={HelloWorldScreen}
          options={{ title: 'Labs' }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'О приложении' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}