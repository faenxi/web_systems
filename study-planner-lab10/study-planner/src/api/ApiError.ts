export type ApiErrorKind = 'config' | 'network' | 'http' | 'parse';

/** Єдиний тип помилки API layer: вищі рівні не розбираються у деталях fetch. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;

  constructor(kind: ApiErrorKind, message: string, status?: number, cause?: unknown) {
    super(message, { cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Скасований через AbortController запит — це не помилка для користувача. */
export function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: unknown }).name === 'AbortError'
  );
}

/** Централізована нормалізація: будь-яка помилка → зрозуміле повідомлення для UI. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'config':
        return error.message;
      case 'network':
        return 'Не вдалося зʼєднатися із сервером. Перевірте інтернет-зʼєднання.';
      case 'parse':
        return 'Сервер повернув некоректну відповідь.';
      case 'http':
        if (error.status === 404) return 'Завдання не знайдено на сервері.';
        if (error.status !== undefined && error.status >= 500) {
          return 'Помилка на боці сервера. Спробуйте пізніше.';
        }
        return `Сервер відхилив запит (код ${error.status ?? '—'}).`;
    }
  }
  return 'Сталася неочікувана помилка.';
}
