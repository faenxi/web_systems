import type { LoadStatus, Task, TaskChanges } from '../types/task';

/** Server state списку задач поточної сторінки. */
export interface TaskListState {
  status: LoadStatus;
  tasks: Task[];
  total: number;
  error: string | null;
}

export type TaskListAction =
  | { type: 'fetchStart' }
  | { type: 'fetchSuccess'; tasks: Task[]; total: number }
  | { type: 'fetchError'; message: string }
  | { type: 'taskAdded'; task: Task }
  | { type: 'taskPatched'; id: number; changes: TaskChanges }
  | { type: 'taskReplaced'; task: Task }
  | { type: 'taskRemoved'; id: number };

export const initialTaskListState: TaskListState = {
  status: 'loading',
  tasks: [],
  total: 0,
  error: null,
};

/** Чиста функція: без HTTP, таймерів і localStorage. */
export function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
  switch (action.type) {
    case 'fetchStart':
      return { ...state, status: 'loading', error: null };

    case 'fetchSuccess':
      return { status: 'success', tasks: action.tasks, total: action.total, error: null };

    case 'fetchError':
      return { ...state, status: 'error', error: action.message };

    case 'taskAdded':
      if (state.tasks.some((task) => task.id === action.task.id)) return state;
      return { ...state, tasks: [action.task, ...state.tasks], total: state.total + 1 };

    case 'taskPatched':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, ...action.changes } : task,
        ),
      };

    case 'taskReplaced':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
      };

    case 'taskRemoved': {
      if (!state.tasks.some((task) => task.id === action.id)) return state;
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
        total: Math.max(0, state.total - 1),
      };
    }

    default:
      return state;
  }
}
