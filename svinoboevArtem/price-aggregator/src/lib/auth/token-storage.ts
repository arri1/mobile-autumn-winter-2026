import * as SecureStore from 'expo-secure-store';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/** Ответ эндпоинтов выдачи токенов в формате OAuth 2.0 (RFC 6749, п. 5.1). */
export type TokenPairResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export function toAuthTokens(response: TokenPairResponse): AuthTokens {
  return { accessToken: response.access_token, refreshToken: response.refresh_token };
}

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

// Кэш в памяти, чтобы не обращаться к Keychain/Keystore на каждый запрос.
// undefined — ещё не читали, null — токенов нет.
let cache: AuthTokens | null | undefined;

/** JWT-токены хранятся только в SecureStore (Keychain / Android Keystore), не в AsyncStorage. */
export const tokenStorage = {
  async get(): Promise<AuthTokens | null> {
    if (cache !== undefined) return cache;
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY, options),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY, options),
    ]);
    cache = accessToken && refreshToken ? { accessToken, refreshToken } : null;
    return cache;
  },

  async set(tokens: AuthTokens): Promise<void> {
    cache = tokens;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken, options),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken, options),
    ]);
  },

  async clear(): Promise<void> {
    cache = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, options),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, options),
    ]);
  },
};
