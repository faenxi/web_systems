import { useEffect, useReducer, useRef, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/ApiError';
import { PAGE_SIZE } from '../data/constants';
import { initialTaskListState, taskListReducer } from '../reducers/taskListReducer';
import { taskRepository } from '../repositories/taskRepository';
import type { Task, TaskChanges } from '../types/task';

/**
 * Server state списку: завантаження сторінки, пагінація та локальне оновлення після mutation.
 * Кожна зміна сторінки / запиту скасовує попередній GET через AbortController.
 */
export function useTaskList(query: string) {
  const [state, dispatch] = useReducer(taskListReducer, initialTaskListState);
  const [reloadKey, setReloadKey] = useState(0);

  // Сторінка «прив'язана» до запиту: новий пошуковий запит автоматично повертає на сторінку 1
  // без Effect і зайвого запиту.
  const [pageState, setPageState] = useState({ query, page: 1 });
  const page = pageState.query === query ? pageState.page : 1;

  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));

  // Актуальні page/query для асинхронних колбеків, які могли замкнути застарілі значення.
  const viewRef = useRef({ page, query });
  useEffect(() => {
    viewRef.current = { page, query };
  });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'fetchStart' });

    taskRepository
      .getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, query, signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        dispatch({ type: 'fetchSuccess', tasks: result.tasks, total: result.total });
      })
      .catch((error: unknown) => {
        // Скасований запит не показуємо як помилку завантаження.
        if (controller.signal.aborted || isAbortError(error)) return;
        dispatch({ type: 'fetchError', message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [page, query, reloadKey]);

  // Якщо після видалення остання сторінка спорожніла — повертаємось на попередню.
  useEffect(() => {
    if (state.status === 'success' && state.tasks.length === 0 && page > 1) {
      setPageState({ query, page: page - 1 });
    }
  }, [state.status, state.tasks.length, page, query]);

  const setPage = (next: number) => {
    setPageState({ query, page: Math.min(Math.max(1, next), totalPages) });
  };

  const retry = () => setReloadKey((key) => key + 1);

  /** Нове завдання: показуємо одразу, якщо ми на першій сторінці без пошуку; інакше йдемо на неї. */
  const showCreated = (task: Task) => {
    const view = viewRef.current;
    if (view.page === 1 && view.query === '') {
      dispatch({ type: 'taskAdded', task });
    } else {
      setPageState({ query: view.query, page: 1 });
    }
  };

  const patchTask = (id: number, changes: TaskChanges) =>
    dispatch({ type: 'taskPatched', id, changes });
  const replaceTask = (task: Task) => dispatch({ type: 'taskReplaced', task });
  const removeTask = (id: number) => dispatch({ type: 'taskRemoved', id });

  return {
    status: state.status,
    tasks: state.tasks,
    total: state.total,
    error: state.error,
    page,
    totalPages,
    setPage,
    retry,
    showCreated,
    patchTask,
    replaceTask,
    removeTask,
  };
}

export type TaskListApi = ReturnType<typeof useTaskList>;
