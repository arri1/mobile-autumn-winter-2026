import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './screens/WelcomeScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import CounterScreen from './screens/CounterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={WelcomeScreen}
          options={{ title: 'Главная' }}
        />

        <Tab.Screen
          name="Counter"
          component={CounterScreen}
          options={{ title: 'Счетчик' }}
        />

        <Tab.Screen
          name="About"
          component={PlaceholderScreen}
          options={{ title: 'О нас' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}