import { getApiBaseUrl } from '../config/env';
import { ApiError, isAbortError } from './ApiError';

export type QueryParams = Record<string, string | number | undefined>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
}

/** Опції, доступні ззовні: метод і body задаються самим методом клієнта. */
type CallOptions = Pick<RequestOptions, 'query' | 'signal'>;

/** Будує URL із VITE_API_URL, шляху та query-параметрів. */
export function buildUrl(path: string, query?: QueryParams): string {
  const base = getApiBaseUrl();
  if (base === null) {
    throw new ApiError('config', 'Не задано VITE_API_URL. Створіть файл .env за прикладом .env.example.');
  }

  let url: URL;
  try {
    url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);
  } catch (error) {
    throw new ApiError('config', 'VITE_API_URL має некоректний формат.', undefined, error);
  }

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/** Читає текст помилки з тіла відповіді (DummyJSON повертає { message }). */
async function readErrorDetail(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as { message: unknown }).message);
    }
  } catch {
    // тіла немає або воно не JSON — достатньо statusText
  }
  return response.statusText;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal } = options;
  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isAbortError(error)) throw error; // скасування пропускаємо як є
    throw new ApiError('network', 'Network request failed', undefined, error);
  }

  // fetch НЕ кидає помилку на 4xx/5xx — статус перевіряємо вручну.
  if (!response.ok) {
    throw new ApiError('http', await readErrorDetail(response), response.status);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError('parse', 'Response is not valid JSON', response.status, error);
  }
}

export const httpClient = {
  get: <T>(path: string, options?: CallOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: CallOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body: unknown, options?: CallOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body: unknown, options?: CallOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: CallOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
