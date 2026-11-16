import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { stackScreenOptions } from '@/components/navigation/tab-stack-options';
import { AppProviders } from '@/providers/app-providers';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Под модалками при диплинке (например, priceaggregator://scanner) всегда лежат табы.
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="scanner"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
        <Stack.Screen name="city" options={{ presentation: 'modal', title: 'Выбор города' }} />
        <Stack.Screen name="sign-in" options={{ presentation: 'modal', title: 'Вход' }} />
      </Stack>
    </AppProviders>
  );
}
