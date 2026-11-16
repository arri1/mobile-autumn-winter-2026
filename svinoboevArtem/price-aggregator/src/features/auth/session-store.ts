import { create } from 'zustand';

import { onSessionExpired } from '@/lib/api/client';
import { queryClient } from '@/lib/api/query-client';
import { tokenStorage, type AuthTokens } from '@/lib/auth/token-storage';

import { meKeys } from './query-keys';

type SessionStatus = 'loading' | 'guest' | 'authenticated';

type SessionState = {
  status: SessionStatus;
  /** Читает токены из SecureStore при старте приложения. */
  hydrate: () => Promise<void>;
  signIn: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
};

// Данные прошлого пользователя не должны пережить смену сессии.
function clearUserData() {
  queryClient.removeQueries({ queryKey: meKeys.all });
}

export const useSessionStore = create<SessionState>()((set) => ({
  status: 'loading',

  hydrate: async () => {
    try {
      const tokens = await tokenStorage.get();
      set({ status: tokens ? 'authenticated' : 'guest' });
    } catch {
      set({ status: 'guest' });
    }
  },

  signIn: async (tokens) => {
    await tokenStorage.set(tokens);
    clearUserData();
    set({ status: 'authenticated' });
  },

  signOut: async () => {
    await tokenStorage.clear();
    clearUserData();
    set({ status: 'guest' });
  },
}));

// Refresh-токен отклонён сервером (токены клиент уже удалил) — пользователь снова гость.
onSessionExpired(() => {
  clearUserData();
  useSessionStore.setState({ status: 'guest' });
});
