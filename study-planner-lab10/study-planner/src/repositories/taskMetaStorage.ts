import { TASK_META_STORAGE_KEY } from '../data/constants';
import { CATEGORIES, PRIORITIES } from '../data/labels';
import type { Category, Priority } from '../types/task';

/**
 * Client-only metadata: DummyJSON не має полів description / priority / category.
 * Це НЕ server state (задачі тут не зберігаються), лише додаткові поля, прив'язані до id.
 */
export interface TaskMeta {
  description: string;
  priority: Priority;
  category: Category;
}

const DEFAULT_META: TaskMeta = { description: '', priority: 'medium', category: 'other' };

let cache: Record<string, TaskMeta> | null = null;

function isMeta(value: unknown): value is TaskMeta {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.description === 'string' &&
    PRIORITIES.includes(m.priority as Priority) &&
    CATEGORIES.includes(m.category as Category)
  );
}

function load(): Record<string, TaskMeta> {
  if (cache !== null) return cache;
  const result: Record<string, TaskMeta> = {};
  try {
    const raw = window.localStorage.getItem(TASK_META_STORAGE_KEY);
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        if (isMeta(value)) result[key] = value;
      }
    }
  } catch {
    // пошкоджений JSON або недоступне сховище — починаємо з порожнього
  }
  cache = result;
  return cache;
}

function persist(): void {
  try {
    window.localStorage.setItem(TASK_META_STORAGE_KEY, JSON.stringify(load()));
  } catch {
    // сховище недоступне — метадані житимуть лише до перезавантаження
  }
}

export const taskMetaStorage = {
  get(id: number): TaskMeta {
    return { ...(load()[String(id)] ?? DEFAULT_META) };
  },
  set(id: number, meta: TaskMeta): void {
    load()[String(id)] = meta;
    persist();
  },
  remove(id: number): void {
    delete load()[String(id)];
    persist();
  },
};
