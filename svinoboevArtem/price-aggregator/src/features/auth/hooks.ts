import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tokenStorage } from '@/lib/auth/token-storage';

import { deleteAccount, fetchMe, logout, requestOtp, updateProfile, verifyOtp } from './api';
import { meKeys } from './query-keys';
import { useSessionStore } from './session-store';

export function useMe() {
  const isAuthenticated = useSessionStore((state) => state.status === 'authenticated');
  return useQuery({
    queryKey: meKeys.profile(),
    queryFn: ({ signal }) => fetchMe(signal),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => queryClient.setQueryData(meKeys.profile(), profile),
  });
}

export function useRequestOtp() {
  return useMutation({ mutationFn: requestOtp });
}

export function useVerifyOtp() {
  const signIn = useSessionStore((state) => state.signIn);
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (tokens) => signIn(tokens),
  });
}

export function useSignOut() {
  const signOut = useSessionStore((state) => state.signOut);
  return useMutation({
    mutationFn: async () => {
      const tokens = await tokenStorage.get();
      // Отзыв refresh-токена на сервере — best effort: выйти локально нужно в любом случае.
      if (tokens) await logout(tokens.refreshToken).catch(() => undefined);
    },
    onSettled: () => signOut(),
  });
}

export function useDeleteAccount() {
  const signOut = useSessionStore((state) => state.signOut);
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => signOut(),
  });
}
