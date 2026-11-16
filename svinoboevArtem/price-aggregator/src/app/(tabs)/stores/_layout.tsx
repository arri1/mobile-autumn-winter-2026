import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/components/navigation/tab-stack-options';

export default function StoresLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Магазины', headerLargeTitle: true }} />
      <Stack.Screen name="[storeId]" options={{ title: '' }} />
    </Stack>
  );
}
