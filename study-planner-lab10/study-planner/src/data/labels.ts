import type { Category, Filter, Priority } from '../types/task';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  study: 'Навчання',
  lab: 'Лабораторна',
  project: 'Проєкт',
  other: 'Інше',
};

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'Усі',
  active: 'Активні',
  completed: 'Виконані',
};

export const PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];
export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
export const FILTERS = Object.keys(FILTER_LABELS) as Filter[];
