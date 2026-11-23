import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Pressable, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CounterScreen from "./screens/CounterScreen";
import WelcomeScreen from './screens/WelcomeScreen';
import AboutScreen from './screens/AboutScreen';
import TimerScreen from './screens/TimerScreen';
import PostsScreen from './screens/PostsScreen';
import PostViewScreen from './screens/PostViewScreen';
import PostFormScreen from './screens/PostFormScreen'

import { Ionicons } from "@expo/vector-icons";

// 1. Описываем типы для навигации постов и экспортируем их
export type RootStackParamList = {
  PostsList: undefined; // Экран списка постов параметров не принимает
  PostView: { id: number }; // Экран просмотра требует обязательный id поста
  PostForm: { id?: number } | undefined;
};

const Tab = createBottomTabNavigator();
// Передаем типы в навигатор стека
const Stack = createNativeStackNavigator<RootStackParamList>();


// 2. Внутренний Стек-навигатор для вкладки "Посты"
function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PostsList" 
        component={PostsScreen} 
        options={{ title: 'Все посты' }} 
      />
      <Stack.Screen 
        name="PostView" 
        component={PostViewScreen} 
        options={{ title: 'Просмотр поста' }} 
      />
      <Stack.Screen 
        name="PostForm" 
        component={PostFormScreen} 
        options={{ title: 'Редактирование' }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={WelcomeScreen}
        options={{
          title: "Главная",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size}/>
          )
        }}/>
        
        <Tab.Screen name="Counter" component={CounterScreen} 
        options={{
          title:"Счётчик",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="add-circle-outline" color={color} size={size}/>
          )
        }}/>

        <Tab.Screen name="Timer" component={TimerScreen}
        options={{
          title:"Таймер",
          tabBarIcon: ({color, size}) =>(
            <Ionicons name="time-outline" color={color} size={size}/>
          )
        }}/>

        {/* Вместо одиночного экрана рендерим наш Стек навигации */}
        <Tab.Screen name="PostsTab" component={PostsStack}
        options={{
          title: "Посты",
          headerShown: false, // Отключаем дублирующий заголовок таб-бара
          tabBarIcon: ({color, size}) => (
            <Ionicons name="newspaper-outline" color={color} size={size}/>
          )
        }}/>

        <Tab.Screen name="About" component={AboutScreen}
        options={{
          title: "Обо мне",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size}/>
          )
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
