import { useEffect, useRef, useState } from 'react';

type RequestState<T> =
  | { status: 'loading'; data?: T }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string; data?: T };

export function usePostRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<RequestState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => {
      if (controller.signal.aborted) return;
      controller.abort();
      setResult(({ data }) => ({ status: 'error', data, message: 'Сервер долго отвечает. Попробуй ещё раз.' }));
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
          setResult(({ data }) => ({ status: 'error', message, data }));
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
      request.current = null;
    };
  }, [attempt, load]);

  function retry(update?: (data: T | undefined) => T) {
    request.current?.abort();
    setResult(({ data }) => ({ status: 'loading', data: update ? update(data) : data }));
    setAttempt((value) => value + 1);
  }

  return { result, retry };
}
