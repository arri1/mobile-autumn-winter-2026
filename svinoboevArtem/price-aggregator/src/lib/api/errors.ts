/** Сервер ответил статусом не из диапазона 2xx. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly data: unknown,
  ) {
    super(`Запрос завершился с кодом ${status}`);
    this.name = 'ApiError';
  }
}

/** Запрос не дошёл до сервера: нет сети, DNS, TLS и т. п. */
export class NetworkError extends Error {
  constructor(readonly cause: unknown) {
    super('Нет соединения с сервером');
    this.name = 'NetworkError';
  }
}

/**
 * Достаёт человекочитаемое сообщение из ошибки.
 * FastAPI отдаёт ошибки как { detail: string } или { detail: [{ msg, loc, type }] } (422).
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = (error.data as { detail?: unknown } | null)?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') return detail[0].msg;
    if (error.status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Что-то пошло не так';
}
