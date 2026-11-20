import { useState } from 'react';
import { getErrorMessage } from '../api/ApiError';
import { taskRepository } from '../repositories/taskRepository';
import type { Task, TaskDraft } from '../types/task';
import type { TaskListApi } from './useTaskList';
import { useToast } from './useToast';

type ListActions = Pick<TaskListApi, 'showCreated' | 'replaceTask' | 'patchTask' | 'removeTask'>;

interface Options {
  /** Завдання змінилось на сервері (оновити відкриті деталі). */
  onChanged?: (id: number) => void;
  /** Завдання видалено (закрити деталі / форму редагування). */
  onRemoved?: (id: number) => void;
}

/**
 * Усі записи (POST / PATCH / DELETE) проходять через taskRepository.
 * Після успіху хук самостійно оновлює client state, бо DummyJSON нічого не зберігає.
 */
export function useTaskMutations(list: ListActions, { onChanged, onRemoved }: Options = {}) {
  const { notify } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(() => new Set());

  const setPending = (id: number, pending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const isPending = (id: number) => pendingIds.has(id);

  const createTask = async (draft: TaskDraft): Promise<boolean> => {
    setIsSaving(true);
    try {
      const task = await taskRepository.create(draft);
      list.showCreated(task);
      notify('Завдання створено');
      return true;
    } catch (error) {
      notify(getErrorMessage(error), 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTask = async (id: number, draft: TaskDraft): Promise<boolean> => {
    setIsSaving(true);
    setPending(id, true);
    try {
      const task = await taskRepository.update(id, draft);
      list.replaceTask(task);
      onChanged?.(id);
      notify('Зміни збережено');
      return true;
    } catch (error) {
      notify(getErrorMessage(error), 'error');
      return false;
    } finally {
      setIsSaving(false);
      setPending(id, false);
    }
  };

  /** Optimistic update: інтерфейс змінюється одразу, а при помилці відкочується. */
  const toggleTask = async (task: Task): Promise<void> => {
    if (pendingIds.has(task.id)) return;
    const next = !task.completed;
    list.patchTask(task.id, { completed: next });
    setPending(task.id, true);
    try {
      await taskRepository.update(task.id, { completed: next });
      onChanged?.(task.id);
    } catch (error) {
      list.patchTask(task.id, { completed: task.completed });
      notify(getErrorMessage(error), 'error');
    } finally {
      setPending(task.id, false);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    setPending(id, true);
    try {
      await taskRepository.delete(id);
      list.removeTask(id);
      onRemoved?.(id);
      notify('Завдання видалено');
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setPending(id, false);
    }
  };

  return { isSaving, isPending, createTask, updateTask, toggleTask, deleteTask };
}
