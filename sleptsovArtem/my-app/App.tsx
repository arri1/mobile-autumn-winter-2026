import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import NameScreen from './src/screens/NameScreen';
import CounterScreen from './src/screens/CounterScreen';
import TimerScreen from './src/screens/TimerScreen';
import PostsScreen from './src/screens/PostsScreen';
import PostViewScreen from './src/screens/PostViewScreen';
import AboutScreen from './src/screens/AboutScreen';

const Tab = createBottomTabNavigator();
const PostStack = createNativeStackNavigator();

function PostsStackScreen() {
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="PostsList"
        component={PostsScreen}
        options={{ title: 'Посты' }}
      />
      <PostStack.Screen
        name="PostView"
        component={PostViewScreen}
        options={{ title: 'Пост' }}
      />
    </PostStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Welcome" component={WelcomeScreen} />
        <Tab.Screen name="Name" component={NameScreen} />
        <Tab.Screen name="Counter" component={CounterScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen
          name="Posts"
          component={PostsStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}