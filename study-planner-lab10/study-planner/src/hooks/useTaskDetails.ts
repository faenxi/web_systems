import { useEffect, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/ApiError';
import { taskRepository } from '../repositories/taskRepository';
import type { LoadStatus, Task } from '../types/task';

interface DetailsState {
  status: LoadStatus;
  task: Task | null;
  error: string | null;
}

/**
 * Локальний state деталей одного завдання (без глобального Context).
 * Завжди читає актуальні дані через getById; refreshKey змушує перезавантажити після змін.
 */
export function useTaskDetails(taskId: number, refreshKey: number) {
  const [state, setState] = useState<DetailsState>({ status: 'loading', task: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    taskRepository
      .getById(taskId, controller.signal)
      .then((task) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', task, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState((prev) => ({ ...prev, status: 'error', error: getErrorMessage(error) }));
      });

    return () => controller.abort();
  }, [taskId, refreshKey, reloadKey]);

  return { ...state, retry: () => setReloadKey((key) => key + 1) };
}
