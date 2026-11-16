import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Варианты сборки позволяют держать на одном устройстве dev-, preview- и prod-версии
 * приложения одновременно. Вариант задаётся переменной APP_VARIANT (см. eas.json).
 * https://docs.expo.dev/tutorial/eas/multiple-app-variants/
 */
type AppVariant = 'development' | 'preview' | 'production';

const APP_VARIANT: AppVariant =
  process.env.APP_VARIANT === 'development' || process.env.APP_VARIANT === 'preview'
    ? process.env.APP_VARIANT
    : 'production';

const BUNDLE_ID = 'com.svinoboev.priceaggregator';

const VARIANTS: Record<AppVariant, { name: string; bundleId: string }> = {
  development: { name: 'Агрегатор цен Dev', bundleId: `${BUNDLE_ID}.dev` },
  preview: { name: 'Агрегатор цен Preview', bundleId: `${BUNDLE_ID}.preview` },
  production: { name: 'Агрегатор цен', bundleId: BUNDLE_ID },
};

const variant = VARIANTS[APP_VARIANT];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variant.name,
  slug: 'priceaggregator',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'priceaggregator',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android'],
  ios: {
    bundleIdentifier: variant.bundleId,
    icon: './assets/expo.icon',
  },
  android: {
    package: variant.bundleId,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-secure-store',
    [
      'expo-camera',
      {
        cameraPermission: 'Камера нужна для сканирования штрихкодов товаров и QR-кодов чеков.',
        microphonePermission: false,
        recordAudioAndroid: false,
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Геопозиция нужна, чтобы определить ваш город, показать ближайшие магазины и построить маршрут за покупками.',
        locationAlwaysAndWhenInUsePermission: false,
        locationAlwaysPermission: false,
      },
    ],
    '@maplibre/maplibre-react-native',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
