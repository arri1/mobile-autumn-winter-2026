import { Stack } from 'expo-router';

export default function PostsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Посты' }} />
      <Stack.Screen name="[id]" options={{ title: 'Просмотр поста' }} />
    </Stack>
  );
}
