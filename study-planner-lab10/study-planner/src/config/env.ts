/** Базова адреса API з environment variable (без завершальних «/»). null — якщо змінну не задано. */
export function getApiBaseUrl(): string | null {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  return raw.trim().replace(/\/+$/, '');
}
