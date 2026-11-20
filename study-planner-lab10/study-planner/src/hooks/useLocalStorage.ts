import { useEffect, useState } from 'react';

/**
 * useState, значення якого зберігається у localStorage.
 * Пошкоджений JSON або значення, що не пройшло isValid, ігноруються.
 * Не використовується для tasks — їх єдине джерело правди це reducer.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      if (isValid && !isValid(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ігноруємо помилки запису (приватний режим, переповнене сховище)
    }
  }, [key, value]);

  return [value, setValue] as const;
}
