/**
 * Публичная конфигурация приложения.
 *
 * EXPO_PUBLIC_* подставляются в бандл при сборке, поэтому секреты здесь хранить нельзя.
 * Обращаться к переменным нужно статически (process.env.EXPO_PUBLIC_X) — иначе Metro
 * не сможет их встроить. https://docs.expo.dev/guides/environment-variables/
 */
export const env = {
  apiUrl: withoutTrailingSlash(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1'),
  mapStyleUrl:
    process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty',
  privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || null,
} as const;

function withoutTrailingSlash(url: string) {
  return url.replace(/\/+$/, '');
}
