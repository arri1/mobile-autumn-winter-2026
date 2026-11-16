import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/components/navigation/tab-stack-options';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Профиль', headerLargeTitle: true }} />
    </Stack>
  );
}
