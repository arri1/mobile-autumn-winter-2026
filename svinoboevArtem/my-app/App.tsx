import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import WelcomeScreen from './src/screens/WelcomeScreen';
import CounterScreen from './src/screens/CounterScreen';
import NameScreen from './src/screens/NameScreen';
import TimerScreen from './src/screens/TimerScreen';
import PostsScreen from './src/screens/PostsScreen';
import PostViewScreen from './src/screens/PostViewScreen';
import PostFormScreen from './src/screens/PostFormScreen';
import AboutScreen from './src/screens/AboutScreen';
import { colors } from './src/theme';
import type { PostsStackParamList, TabParamList } from './src/navigation/types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<PostsStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof TabParamList, IconName> = {
  Home: 'home',
  Counter: 'add-circle',
  Name: 'create',
  Timer: 'timer',
  Posts: 'newspaper',
  About: 'person',
};

// Стек внутри вкладки Posts: список → пост → форма создания/редактирования.
function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: 'Посты' }} />
      <Stack.Screen name="PostView" component={PostViewScreen} options={{ title: 'Пост' }} />
      <Stack.Screen name="PostForm" component={PostFormScreen} options={{ title: 'Новый пост' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, size, focused }) => {
            const base = TAB_ICONS[route.name];
            const name = (focused ? base : `${base}-outline`) as IconName;
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={WelcomeScreen} options={{ title: 'Главная' }} />
        <Tab.Screen name="Counter" component={CounterScreen} options={{ title: 'Счётчик' }} />
        <Tab.Screen name="Name" component={NameScreen} options={{ title: 'Имя' }} />
        <Tab.Screen name="Timer" component={TimerScreen} options={{ title: 'Эффекты' }} />
        <Tab.Screen
          name="Posts"
          component={PostsStack}
          options={{ title: 'Посты', headerShown: false }}
        />
        <Tab.Screen name="About" component={AboutScreen} options={{ title: 'О себе' }} />
      </Tab.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
