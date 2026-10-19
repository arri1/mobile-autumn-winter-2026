import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CounterScreen from './src/screens/CounterScreen';
import NameScreen from './src/screens/NameScreen';
import TimerScreen from './src/screens/TimerScreen';
import PostsStack from './src/screens/PostsStack';
import AboutScreen from './src/screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#111',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen name="Home" component={WelcomeScreen} />
        <Tab.Screen name="Counter" component={CounterScreen} />
        <Tab.Screen name="Name" component={NameScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Posts" component={PostsStack} options={{ headerShown: false }} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
