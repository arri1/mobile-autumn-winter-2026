import { useEffect, useState } from 'react';

type RequestState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export function usePostRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<RequestState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setResult({ status: 'error', message: 'Сервер долго отвечает. Попробуй ещё раз.' });
    }, 12000);

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error && !(error instanceof TypeError)
            ? error.message
            : 'Не удалось подключиться к серверу курса.';
          setResult({ status: 'error', message });
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt, load]);

  function retry() {
    setResult({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  return { result, retry };
}
