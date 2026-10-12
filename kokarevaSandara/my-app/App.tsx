import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from './screens/WelcomeScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import CounterScreen from './screens/CounterScreen';
import TimerScreen from './screens/TimerScreen';
import PostsStack from './PostsStack';
import PostsScreen from './screens/PostsScreen'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Labs') {
              iconName = focused ? 'folder' : 'folder-outline';
            }
            else if (route.name === 'Counter') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            else if (route.name === 'Timer') {
              iconName = focused ? 'timer' : 'timer-outline';
            }
            else if (route.name === 'Posts') {
              iconName = focused ? 'albums' : 'albums-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={WelcomeScreen} />
        <Tab.Screen name="Labs" component={PlaceholderScreen} />
        <Tab.Screen name="Counter" component={CounterScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Posts" component={PostsStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}