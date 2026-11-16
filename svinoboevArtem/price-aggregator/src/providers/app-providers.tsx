import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { useSessionStore } from '@/features/auth/session-store';
import { useCartStore } from '@/features/cart/cart-store';
import { useCityStore } from '@/features/city/city-store';
import { queryClient } from '@/lib/api/query-client';
import { Colors } from '@/theme';

const PERSISTED_STORES = [useCityStore, useCartStore];

const allHydrated = () => PERSISTED_STORES.every((store) => store.persist.hasHydrated());

function subscribeToHydration(onChange: () => void) {
  const unsubscribers = PERSISTED_STORES.map((store) => store.persist.onFinishHydration(onChange));
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

/** Zustand восстанавливает состояние из AsyncStorage асинхронно — ждём, чтобы экраны не мигали. */
function usePersistedStoresHydrated() {
  return useSyncExternalStore(subscribeToHydration, allHydrated);
}

function navigationTheme(isDark: boolean): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  const colors = isDark ? Colors.dark : Colors.light;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.canvas,
      card: colors.canvas,
      text: colors.text,
      border: colors.border,
    },
  };
}

export function AppProviders({ children }: { children: ReactNode }) {
  const isDark = useColorScheme() === 'dark';
  const sessionStatus = useSessionStore((state) => state.status);
  const storesHydrated = usePersistedStoresHydrated();
  const [fontsLoaded, fontsError] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  // Если шрифты не загрузились, приложение всё равно открывается — на системном шрифте.
  const fontsReady = fontsLoaded || fontsError !== null;
  const isReady = sessionStatus !== 'loading' && storesHydrated && fontsReady;

  useEffect(() => {
    useSessionStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  // React Query по умолчанию слушает window focus; в RN фокус — это AppState.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);

  // Пока не готовы — остаётся нативный сплэш.
  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme(isDark)}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
