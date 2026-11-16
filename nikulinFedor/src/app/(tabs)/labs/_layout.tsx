import { Stack } from 'expo-router';

export default function LabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Лабы' }} />
      <Stack.Screen name="name" options={{ title: 'Имя' }} />
      <Stack.Screen name="timer" options={{ title: 'Таймер' }} />
    </Stack>
  );
}
