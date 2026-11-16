import { tokenStorage, type AuthTokens } from '@/lib/auth/token-storage';

import { apiRequest, buildUrl, onSessionExpired } from './client';
import { ApiError, getErrorMessage, NetworkError } from './errors';

jest.mock('@/lib/env', () => ({ env: { apiUrl: 'https://api.test/v1' } }));

jest.mock('@/lib/auth/token-storage', () => {
  let tokens: unknown = null;
  return {
    ...jest.requireActual('@/lib/auth/token-storage'),
    tokenStorage: {
      get: jest.fn(async () => tokens),
      set: jest.fn(async (next: unknown) => {
        tokens = next;
      }),
      clear: jest.fn(async () => {
        tokens = null;
      }),
    },
  };
});

const fetchMock = jest.fn();
globalThis.fetch = fetchMock as unknown as typeof fetch;

function jsonResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function authHeader(init: RequestInit | undefined) {
  return (init?.headers as Record<string, string> | undefined)?.Authorization;
}

const OLD: AuthTokens = { accessToken: 'old-access', refreshToken: 'old-refresh' };

beforeEach(async () => {
  fetchMock.mockReset();
  await tokenStorage.clear();
});

describe('buildUrl', () => {
  it('добавляет query-параметры, повторяя ключ для массивов и пропуская пустые', () => {
    expect(
      buildUrl('/stores', { city_id: 'msk', type: ['hypermarket', 'discounter'], q: undefined }),
    ).toBe('https://api.test/v1/stores?city_id=msk&type=hypermarket&type=discounter');
  });

  it('кодирует значения', () => {
    expect(buildUrl('/search', { q: 'молоко 3,2%' })).toBe(
      'https://api.test/v1/search?q=%D0%BC%D0%BE%D0%BB%D0%BE%D0%BA%D0%BE%203%2C2%25',
    );
  });
});

describe('apiRequest', () => {
  it('подставляет access-токен, если пользователь авторизован', async () => {
    await tokenStorage.set(OLD);
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 1 }));

    await expect(apiRequest('/users/me')).resolves.toEqual({ id: 1 });
    expect(authHeader(fetchMock.mock.calls[0][1])).toBe('Bearer old-access');
  });

  it('не подставляет токен для публичных запросов', async () => {
    await tokenStorage.set(OLD);
    fetchMock.mockResolvedValue(jsonResponse(204));

    await apiRequest('/auth/otp/request', { method: 'POST', body: {}, auth: false });
    expect(authHeader(fetchMock.mock.calls[0][1])).toBeUndefined();
  });

  it('на 401 обновляет токены одним запросом и повторяет все упавшие запросы', async () => {
    await tokenStorage.set(OLD);
    fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(200, {
          access_token: 'new-access',
          refresh_token: 'new-refresh',
          token_type: 'bearer',
        });
      }
      return authHeader(init) === 'Bearer new-access'
        ? jsonResponse(200, { url })
        : jsonResponse(401, { detail: 'Token expired' });
    });

    const results = await Promise.all([apiRequest('/a'), apiRequest('/b')]);

    expect(results).toEqual([{ url: 'https://api.test/v1/a' }, { url: 'https://api.test/v1/b' }]);
    const refreshCalls = fetchMock.mock.calls.filter(([url]) => url.endsWith('/auth/refresh'));
    expect(refreshCalls).toHaveLength(1);
    expect(JSON.parse(refreshCalls[0][1].body)).toEqual({ refresh_token: 'old-refresh' });
    await expect(tokenStorage.get()).resolves.toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  it('если refresh отклонён — сбрасывает сессию и пробрасывает исходную ошибку', async () => {
    await tokenStorage.set(OLD);
    const listener = jest.fn();
    const unsubscribe = onSessionExpired(listener);
    fetchMock.mockResolvedValue(jsonResponse(401, { detail: 'Token expired' }));

    const error = await apiRequest('/users/me').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(listener).toHaveBeenCalledTimes(1);
    await expect(tokenStorage.get()).resolves.toBeNull();
    unsubscribe();
  });

  it('не сбрасывает сессию, если refresh упал из-за сбоя сервера', async () => {
    await tokenStorage.set(OLD);
    const listener = jest.fn();
    const unsubscribe = onSessionExpired(listener);
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith('/auth/refresh') ? jsonResponse(503) : jsonResponse(401),
    );

    const error = await apiRequest('/users/me').catch((e: unknown) => e);

    expect((error as ApiError).status).toBe(503);
    expect(listener).not.toHaveBeenCalled();
    await expect(tokenStorage.get()).resolves.toEqual(OLD);
    unsubscribe();
  });

  it('гость получает 401 без попытки refresh', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401));

    await expect(apiRequest('/users/me')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('оборачивает сетевые сбои в NetworkError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    await expect(apiRequest('/stores')).rejects.toBeInstanceOf(NetworkError);
  });

  it('достаёт сообщение об ошибке из ответа FastAPI', async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, { detail: [{ msg: 'Некорректный телефон' }] }));

    const error = await apiRequest('/auth/otp/request', { auth: false }).catch((e: unknown) => e);
    expect(getErrorMessage(error)).toBe('Некорректный телефон');
  });
});
