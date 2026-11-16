import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeTab from './screens/WelcomeTab';
import CounterTab from './screens/CounterTab';
import NameTab from './screens/NameTab';
import TimerTab from './screens/TimerTab';
import FakeLoadTab from './screens/FakeLoadTab';
import PostsTab from './screens/PostsTab';
import PostViewTab from './screens/PostViewTab';
import PostFormTab from './screens/PostFormTab';
import PlaceholderTab from './screens/PlaceholderTab';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsList"
        component={PostsTab}
        options={{ title: 'Posts' }}
      />
      <Stack.Screen
        name="PostView"
        component={PostViewTab}
        options={{ title: 'Пост' }}
      />
      <Stack.Screen
        name="PostCreate"
        component={PostFormTab}
        options={{ title: 'Новый пост' }}
      />
      <Stack.Screen
        name="PostEdit"
        component={PostFormTab}
        options={{ title: 'Редактировать' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={WelcomeTab} />
        <Tab.Screen name="Labs" component={CounterTab} />
        <Tab.Screen name="Name" component={NameTab} />
        <Tab.Screen name="Timer" component={TimerTab} />
        <Tab.Screen name="Load" component={FakeLoadTab} />
        <Tab.Screen name="Posts" component={PostsStack} options={{ headerShown: false }}
        />
        <Tab.Screen name="About" component={PlaceholderTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}