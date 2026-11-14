import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" options={{ title: 'Кампус СВФУ' }} />
        <Stack.Screen name="kfen" options={{ title: 'Внутри КФЕН' }} />
      </Stack>
    </>
  );
}
