import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import WelcomeScreen from './screens/WelcomeScreen';
import LabsScreen from './screens/LabsScreen';
import NameScreen from './screens/NameScreen';
import EffectsScreen from './screens/EffectsScreen';
import PostsScreen from './screens/PostsScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import AboutScreen from './screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: 'Посты' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Пост' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Новый пост' }} />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Labs') iconName = 'flask-outline';
          else if (route.name === 'Name') iconName = 'text-outline';
          else if (route.name === 'Effects') iconName = 'time-outline';
          else if (route.name === 'Posts') iconName = 'newspaper-outline';
          else if (route.name === 'About') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={WelcomeScreen} />
      <Tab.Screen name="Labs" component={LabsScreen} />
      <Tab.Screen name="Name" component={NameScreen} />
      <Tab.Screen name="Effects" component={EffectsScreen} />
      <Tab.Screen name="Posts" component={PostsStack} options={{ headerShown: false }} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tabs />
    </NavigationContainer>
  );
}