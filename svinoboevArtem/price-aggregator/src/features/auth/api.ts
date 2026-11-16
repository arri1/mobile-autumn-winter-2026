import { apiRequest } from '@/lib/api/client';
import { toAuthTokens, type AuthTokens, type TokenPairResponse } from '@/lib/auth/token-storage';

import type { OtpChannel, UserProfile } from './types';

export type RequestOtpInput = {
  channel: OtpChannel;
  destination: string;
  /** Явное согласие на обработку ПДн (ФЗ-152) — даётся до передачи email/телефона. */
  personal_data_consent: true;
};

export function requestOtp(input: RequestOtpInput) {
  return apiRequest<void>('/auth/otp/request', { method: 'POST', body: input, auth: false });
}

export type VerifyOtpInput = {
  channel: OtpChannel;
  destination: string;
  code: string;
};

export async function verifyOtp(input: VerifyOtpInput): Promise<AuthTokens> {
  const response = await apiRequest<TokenPairResponse>('/auth/otp/verify', {
    method: 'POST',
    body: input,
    auth: false,
  });
  return toAuthTokens(response);
}

export function logout(refreshToken: string) {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  });
}

export function fetchMe(signal?: AbortSignal) {
  return apiRequest<UserProfile>('/users/me', { signal });
}

export function updateProfile(displayName: string) {
  return apiRequest<UserProfile>('/users/me', {
    method: 'PATCH',
    body: { display_name: displayName },
  });
}

/** Полное удаление аккаунта и связанных данных по запросу пользователя (ФЗ-152). */
export function deleteAccount() {
  return apiRequest<void>('/users/me', { method: 'DELETE' });
}
