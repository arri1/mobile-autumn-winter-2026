import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostsScreen from './screens/PostsScreen';
import PostViewScreen from './screens/PostViewScreen';

const Stack = createNativeStackNavigator();

export default function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: 'Posts' }} />
      <Stack.Screen name="PostView" component={PostViewScreen} options={{ title: 'Пост' }} />
    </Stack.Navigator>
  );
}