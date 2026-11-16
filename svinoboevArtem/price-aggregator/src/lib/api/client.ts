import {
  toAuthTokens,
  tokenStorage,
  type AuthTokens,
  type TokenPairResponse,
} from '@/lib/auth/token-storage';
import { env } from '@/lib/env';

import { ApiError, NetworkError } from './errors';

type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[];

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Подставлять ли access-токен (если он есть). false — для публичных эндпоинтов авторизации. */
  auth?: boolean;
  signal?: AbortSignal;
};

const REFRESH_PATH = '/auth/refresh';

const sessionExpiredListeners = new Set<() => void>();

/** Вызывается, когда refresh-токен отклонён сервером и пользователь должен войти заново. */
export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

/**
 * Запрос к бэкенду. Access-токен подставляется автоматически; на 401 клиент один раз
 * обновляет пару токенов через refresh-токен и повторяет запрос.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options;
  const tokens = auth ? await tokenStorage.get() : null;

  try {
    return await send<T>(path, options, tokens?.accessToken);
  } catch (error) {
    if (!tokens || !(error instanceof ApiError) || error.status !== 401) throw error;

    // Пока запрос летал, токены мог обновить параллельный запрос — тогда просто повторяем.
    const current = await tokenStorage.get();
    const fresh =
      current && current.accessToken !== tokens.accessToken ? current : await refreshTokens();
    if (!fresh) throw error;
    return send<T>(path, options, fresh.accessToken);
  }
}

let refreshInFlight: Promise<AuthTokens | null> | null = null;

/** Single-flight: одновременные 401 приводят к одному запросу на обновление токенов. */
function refreshTokens(): Promise<AuthTokens | null> {
  refreshInFlight ??= (async () => {
    try {
      const current = await tokenStorage.get();
      if (!current) return null;
      const response = await send<TokenPairResponse>(REFRESH_PATH, {
        method: 'POST',
        body: { refresh_token: current.refreshToken },
      });
      const tokens = toAuthTokens(response);
      await tokenStorage.set(tokens);
      return tokens;
    } catch (error) {
      // Сеть или сбой сервера — токены не трогаем, сессия ещё может быть жива.
      if (!(error instanceof ApiError) || error.status >= 500) throw error;
      await tokenStorage.clear();
      sessionExpiredListeners.forEach((listener) => listener());
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function send<T>(path: string, options: RequestOptions, accessToken?: string): Promise<T> {
  const { method = 'GET', query, body, signal } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // Отмену запроса (React Query отменяет устаревшие запросы) пробрасываем как есть.
    if (signal?.aborted) throw error;
    throw new NetworkError(error);
  }

  const data = await parseBody(response);
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

/** Массивы сериализуются повторением ключа (?type=a&type=b) — так их ожидает FastAPI. */
export function buildUrl(path: string, query?: RequestOptions['query']): string {
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
    }
  }
  const search = pairs.length > 0 ? `?${pairs.join('&')}` : '';
  return `${env.apiUrl}${path}${search}`;
}
