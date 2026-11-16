import { router } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useRequestOtp, useVerifyOtp } from '@/features/auth/hooks';
import type { OtpChannel } from '@/features/auth/types';
import { isValidEmail, normalizeRuPhone } from '@/features/auth/validation';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api/errors';
import { env } from '@/lib/env';
import { Fonts, Spacing } from '@/theme';

/** Вход по email или телефону с одноразовым кодом (ТЗ, п. 4.1). OAuth 2.0 — следующим шагом. */
export default function SignInScreen() {
  const [channel, setChannel] = useState<OtpChannel>('email');
  const [input, setInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const destination =
    channel === 'phone' ? normalizeRuPhone(input) : isValidEmail(input) ? input.trim() : null;

  function switchChannel(next: OtpChannel) {
    setChannel(next);
    setInput('');
    requestOtp.reset();
  }

  function sendCode() {
    if (!destination) return;
    requestOtp.mutate(
      { channel, destination, personal_data_consent: true },
      { onSuccess: () => setSentTo(destination) },
    );
  }

  function confirmCode() {
    if (!sentTo) return;
    verifyOtp.mutate(
      { channel, destination: sentTo, code: code.trim() },
      { onSuccess: () => router.back() },
    );
  }

  if (sentTo) {
    return (
      <Screen>
        <View style={styles.titles}>
          <Text variant="title">Введите код</Text>
          <Text color="textSecondary">Отправили его на {sentTo}. Код действует 5 минут.</Text>
        </View>
        <TextField
          accessibilityLabel="Код из сообщения"
          placeholder="••••••"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, ''));
            verifyOtp.reset();
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          style={styles.code}
          error={verifyOtp.isError ? getErrorMessage(verifyOtp.error) : null}
        />
        <Button
          title="Войти"
          loading={verifyOtp.isPending}
          disabled={code.length < 4}
          onPress={confirmCode}
        />
        <Button
          title="Изменить номер или email"
          variant="ghost"
          onPress={() => {
            setSentTo(null);
            setCode('');
            verifyOtp.reset();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.titles}>
        <Text variant="title">Вход по коду</Text>
        <Text color="textSecondary">
          Пароль не нужен: пришлём одноразовый код. Если аккаунта ещё нет, он создастся сам.
        </Text>
      </View>

      <View style={styles.chips}>
        <Chip label="Email" selected={channel === 'email'} onPress={() => switchChannel('email')} />
        <Chip
          label="Телефон"
          selected={channel === 'phone'}
          onPress={() => switchChannel('phone')}
        />
      </View>

      {channel === 'phone' ? (
        <TextField
          key="phone"
          label="Номер телефона"
          placeholder="+7 999 123-45-67"
          value={input}
          onChangeText={setInput}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
        />
      ) : (
        <TextField
          key="email"
          label="Email"
          placeholder="name@example.com"
          value={input}
          onChangeText={setInput}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <ConsentCheckbox value={consent} onChange={setConsent} />

      {requestOtp.isError ? (
        <Notice tone="danger" text={getErrorMessage(requestOtp.error)} />
      ) : null}
      <Button
        title="Получить код"
        loading={requestOtp.isPending}
        disabled={!destination || !consent}
        onPress={sendCode}
      />
    </Screen>
  );
}

/** Явное согласие на обработку персональных данных (ФЗ-152) до отправки контакта на сервер. */
function ConsentCheckbox({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const colors = useTheme();
  const policyUrl = env.privacyPolicyUrl;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Согласие на обработку персональных данных"
      onPress={() => onChange(!value)}
      style={styles.consent}>
      <Icon
        name={value ? 'checkboxOn' : 'checkboxOff'}
        color={value ? colors.primary : colors.textSecondary}
      />
      <Text variant="caption" color="textSecondary" style={styles.consentText}>
        Я даю согласие на обработку персональных данных
        {policyUrl ? (
          <>
            {' '}
            в соответствии с{' '}
            <Text variant="caption" color="primary" onPress={() => openBrowserAsync(policyUrl)}>
              политикой конфиденциальности
            </Text>
          </>
        ) : null}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titles: { gap: Spacing.xs },
  chips: { flexDirection: 'row', gap: Spacing.sm },
  code: { fontFamily: Fonts.extrabold, fontSize: 26, letterSpacing: 8, textAlign: 'center' },
  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 44,
  },
  consentText: { flex: 1 },
});
