import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/components/navigation/tab-stack-options';

export default function CartLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Корзина', headerLargeTitle: true }} />
    </Stack>
  );
}
