import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AboutScreen } from './screens/AboutScreen';
import { CounterScreen } from './screens/CounterScreen';
import { LabsScreen } from './screens/LabsScreen';
import { PostsScreen } from './screens/PostsScreen';
import { PostViewScreen } from './screens/PostViewScreen';
import { TimerScreen } from './screens/TimerScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import type { LabsStackParamList, RootTabParamList } from './navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const LabStack = createNativeStackNavigator<LabsStackParamList>();

function LabsNavigator() {
  return (
    <LabStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fffefa' },
        headerTintColor: '#176b57',
        headerTitleStyle: { color: '#202b26', fontWeight: '700' },
        contentStyle: { backgroundColor: '#f7f5ee' },
      }}
    >
      <LabStack.Screen name="LabsHome" component={LabsScreen} options={{ title: 'Лабораторные' }} />
      <LabStack.Screen name="Counter" component={CounterScreen} options={{ title: 'Счётчик' }} />
      <LabStack.Screen name="Timer" component={TimerScreen} options={{ title: 'Таймер useEffect' }} />
      <LabStack.Screen name="Posts" component={PostsScreen} options={{ title: 'Посты курса' }} />
      <LabStack.Screen name="PostView" component={PostViewScreen} options={{ title: 'Пост' }} />
    </LabStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#176b57',
          tabBarInactiveTintColor: '#8b918b',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
          tabBarStyle: {
            height: 68,
            paddingTop: 8,
            borderTopColor: '#e9e7df',
            backgroundColor: '#fffefa',
          },
        }}
      >
        <Tab.Screen name="Home" component={WelcomeScreen} options={{ title: 'Главная', tabBarLabel: 'Главная' }} />
        <Tab.Screen name="Labs" component={LabsNavigator} options={{ title: 'Лабы', tabBarLabel: 'Лабы' }} />
        <Tab.Screen name="About" component={AboutScreen} options={{ title: 'О проекте', tabBarLabel: 'О проекте' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
