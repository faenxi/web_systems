import { ApiError } from '../api/ApiError';
import { httpClient } from '../api/httpClient';
import type { ApiTodo, TodosResponse } from '../types/api';
import type { Task, TaskChanges, TaskDraft } from '../types/task';
import { sessionOverlay } from './sessionOverlay';
import { taskMetaStorage } from './taskMetaStorage';
import type { TaskMeta } from './taskMetaStorage';

/**
 * Repository ховає від UI endpoint-и, DTO-формат DummyJSON та симуляцію запису.
 * Компоненти й хуки бачать лише domain-модель Task.
 */
const TODOS = '/todos';
const CURRENT_USER_ID = 1;

export interface GetAllParams {
  limit: number;
  skip: number;
  query?: string;
  signal?: AbortSignal;
}

export interface TaskPage {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

/** DTO → domain. Поля, яких немає в API, беруться з client-only metadata. */
function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    completed: todo.completed,
    ...taskMetaStorage.get(todo.id),
  };
}

async function loadTodo(id: number, signal?: AbortSignal): Promise<ApiTodo> {
  if (sessionOverlay.isDeleted(id)) {
    throw new ApiError('http', `Todo with id '${id}' not found`, 404);
  }
  const createdTodo = sessionOverlay.getCreated(id);
  if (createdTodo) return createdTodo; // створене в цій сесії — сервер про нього не знає
  const todo = await httpClient.get<ApiTodo>(`${TODOS}/${id}`, { signal });
  return sessionOverlay.resolve(todo);
}

export const taskRepository = {
  /** GET /todos?limit&skip  або  GET /todos/search?q&limit&skip */
  async getAll({ limit, skip, query, signal }: GetAllParams): Promise<TaskPage> {
    const search = query?.trim() ?? '';
    const response =
      search === ''
        ? await httpClient.get<TodosResponse>(TODOS, { query: { limit, skip }, signal })
        : await httpClient.get<TodosResponse>(`${TODOS}/search`, {
            query: { q: search, limit, skip },
            signal,
          });

    if (!Array.isArray(response.todos) || typeof response.total !== 'number') {
      throw new ApiError('parse', 'Unexpected todos response shape');
    }

    const page = sessionOverlay.applyToPage(response, {
      includeCreated: search === '' && skip === 0,
      adjustTotal: search === '',
    });
    return {
      tasks: page.todos.map(toTask),
      total: page.total,
      skip: response.skip,
      limit: response.limit,
    };
  },

  /** GET /todos/:id */
  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    return toTask(await loadTodo(id, signal));
  },

  /** POST /todos/add */
  async create(draft: TaskDraft, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.post<ApiTodo>(
      `${TODOS}/add`,
      { todo: draft.title, completed: false, userId: CURRENT_USER_ID },
      { signal },
    );
    const todo = sessionOverlay.registerCreated(response);
    taskMetaStorage.set(todo.id, {
      description: draft.description,
      priority: draft.priority,
      category: draft.category,
    });
    return toTask({ ...todo, todo: draft.title });
  },

  /** PATCH /todos/:id — на сервер йдуть лише title і completed, решта — client-only metadata. */
  async update(id: number, changes: TaskChanges, signal?: AbortSignal): Promise<Task> {
    const apiPatch: Partial<ApiTodo> = {};
    if (changes.title !== undefined) apiPatch.todo = changes.title;
    if (changes.completed !== undefined) apiPatch.completed = changes.completed;

    let todo: ApiTodo;
    if (sessionOverlay.isCreated(id)) {
      todo = sessionOverlay.updateCreated(id, apiPatch);
    } else if (Object.keys(apiPatch).length > 0) {
      const response = await httpClient.patch<ApiTodo>(`${TODOS}/${id}`, apiPatch, { signal });
      sessionOverlay.rememberPatch(id, apiPatch);
      todo = sessionOverlay.resolve({ ...response, ...apiPatch });
    } else {
      todo = await loadTodo(id, signal);
    }

    // Metadata оновлюємо лише після успішної відповіді сервера.
    const metaChanges: Partial<TaskMeta> = {};
    if (changes.description !== undefined) metaChanges.description = changes.description;
    if (changes.priority !== undefined) metaChanges.priority = changes.priority;
    if (changes.category !== undefined) metaChanges.category = changes.category;
    if (Object.keys(metaChanges).length > 0) {
      taskMetaStorage.set(id, { ...taskMetaStorage.get(id), ...metaChanges });
    }

    return toTask(todo);
  },

  /** DELETE /todos/:id */
  async delete(id: number, signal?: AbortSignal): Promise<void> {
    if (!sessionOverlay.isCreated(id)) {
      await httpClient.delete<unknown>(`${TODOS}/${id}`, { signal });
    }
    sessionOverlay.remove(id);
    taskMetaStorage.remove(id);
  },
};
