import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostsScreen from './PostsScreen';
import PostViewScreen from './PostViewScreen';

export type PostsStackParamList = {
  PostsList: undefined;
  PostView: { id: number };
};

const Stack = createNativeStackNavigator<PostsStackParamList>();

export default function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: 'Посты' }} />
      <Stack.Screen name="PostView" component={PostViewScreen} options={{ title: 'Пост' }} />
    </Stack.Navigator>
  );
}
