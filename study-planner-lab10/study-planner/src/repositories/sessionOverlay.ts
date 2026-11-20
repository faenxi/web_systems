import type { ApiTodo, TodosResponse } from '../types/api';

/**
 * DummyJSON лише СИМУЛЮЄ POST / PATCH / DELETE: відповідь приходить, але сервер нічого не зберігає.
 * Щоб інтерфейс поводився послідовно (нове завдання не зникає при зміні сторінки, його можна
 * відкрити, змінити чи видалити), repository запам'ятовує результат записів у пам'яті на час сесії.
 * Це НЕ localStorage і не другий backend: після перезавантаження сторінки все скидається.
 */
const created = new Map<number, ApiTodo>();
const patches = new Map<number, Partial<ApiTodo>>();
const deleted = new Set<number>();
let lastCreatedId = 0;

function withPatch(todo: ApiTodo): ApiTodo {
  const patch = patches.get(todo.id);
  return patch ? { ...todo, ...patch } : todo;
}

export const sessionOverlay = {
  /** DummyJSON на кожен POST повертає той самий id, тому гарантуємо унікальність. */
  registerCreated(response: ApiTodo): ApiTodo {
    lastCreatedId = Math.max(response.id, lastCreatedId + 1);
    const todo = { ...response, id: lastCreatedId };
    created.set(todo.id, todo);
    return todo;
  },

  isCreated: (id: number): boolean => created.has(id),
  isDeleted: (id: number): boolean => deleted.has(id),
  getCreated: (id: number): ApiTodo | undefined => created.get(id),

  updateCreated(id: number, changes: Partial<ApiTodo>): ApiTodo {
    const todo = { ...created.get(id)!, ...changes, id };
    created.set(id, todo);
    return todo;
  },

  rememberPatch(id: number, changes: Partial<ApiTodo>): void {
    patches.set(id, { ...patches.get(id), ...changes });
  },

  /** Накладає запам'ятовані зміни на todo, отриману з сервера. */
  resolve: withPatch,

  remove(id: number): void {
    if (!created.delete(id)) deleted.add(id);
    patches.delete(id);
  },

  /** Накладає сесійні зміни на сторінку списку, отриману з сервера. */
  applyToPage(
    response: TodosResponse,
    options: { includeCreated: boolean; adjustTotal: boolean },
  ): { todos: ApiTodo[]; total: number } {
    const fromServer = response.todos.filter((todo) => !deleted.has(todo.id)).map(withPatch);
    const todos = options.includeCreated
      ? [...Array.from(created.values()).reverse(), ...fromServer]
      : fromServer;
    const total = options.adjustTotal ? response.total - deleted.size + created.size : response.total;
    return { todos, total };
  },
};
