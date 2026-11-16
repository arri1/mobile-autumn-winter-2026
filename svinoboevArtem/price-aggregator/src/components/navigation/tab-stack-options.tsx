import type { NativeStackNavigationOptions } from 'expo-router';

import { ScanButton } from '@/features/scanner/components/scan-button';
import { Fonts } from '@/theme';

/** Оформление хедеров, общее для всех стеков приложения. */
export const stackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: 'minimal',
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: Fonts.bold, fontSize: 17 },
  headerLargeTitleStyle: { fontFamily: Fonts.extrabold },
};

/** Стеки внутри табов: плюс кнопка сканера в хедере каждого раздела. */
export const tabStackScreenOptions: NativeStackNavigationOptions = {
  ...stackScreenOptions,
  headerRight: () => <ScanButton />,
};
