import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { useSessionStore } from '@/features/auth/session-store';
import { createQueryClient } from '@/lib/api/query-client';

import { classifyScan } from '../classify-scan';
import { ScanResultPanel } from './scan-result-panel';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), dismiss: jest.fn() } }));

function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>;
}

const RECEIPT = 't=20240115T1830&s=1234.56&fn=7281440500123456&i=12345&fp=1234567890&n=1';

describe('ScanResultPanel', () => {
  beforeEach(() => {
    useSessionStore.setState({ status: 'guest' });
    jest.mocked(router.push).mockClear();
  });

  it('предлагает гостю войти, чтобы отправить чек', async () => {
    await render(<ScanResultPanel result={classifyScan(RECEIPT)} onRescan={jest.fn()} />, {
      wrapper: Providers,
    });

    expect(screen.getByText(/Чек на/)).toBeOnTheScreen();
    expect(screen.getByText('Войдите, чтобы отправлять чеки и обновлять цены.')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Войти' }));
    expect(router.push).toHaveBeenCalledWith('/sign-in');
  });

  it('сообщает о нераспознанном коде и даёт отсканировать заново', async () => {
    const onRescan = jest.fn();
    await render(<ScanResultPanel result={classifyScan('hello')} onRescan={onRescan} />, {
      wrapper: Providers,
    });

    expect(screen.getByText('Код не распознан')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Сканировать ещё' }));
    expect(onRescan).toHaveBeenCalledTimes(1);
  });
});
