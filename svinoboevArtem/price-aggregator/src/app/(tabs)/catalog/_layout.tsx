import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/components/navigation/tab-stack-options';

export default function CatalogLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Товары', headerLargeTitle: true }} />
      <Stack.Screen name="category/[categoryId]" options={{ title: '' }} />
      <Stack.Screen name="product/[productId]" options={{ title: '' }} />
    </Stack>
  );
}
