# Study Planner — лабораторна робота №10

React 19 + TypeScript + Vite, стилі — SCSS + BEM. Тема: React та REST API — API layer, Repository Pattern, асинхронні операції, CRUD, пагінація, скасування запитів.

Джерело даних — [DummyJSON Todos](https://dummyjson.com/todos).

## Запуск

```bash
npm install
cp .env.example .env     # VITE_API_URL=https://dummyjson.com
npm run dev
npm run lint
npm run build
```

Потрібен Node.js 22.22+. Файл `.env` у Git не потрапляє (`.gitignore`), у репозиторії лише `.env.example`.

## Архітектура

```text
UI-компоненти (components/, pages/)      ← не знають про URL і fetch
        │  props / callbacks
Хуки (hooks/)                            ← server state, mutations, AbortController
        │
taskRepository (repositories/)           ← endpoint-и, DTO ↔ Task, симуляція запису
        │
httpClient (api/)                        ← fetch, VITE_API_URL, response.ok, ApiError
```

| Вимога | Де реалізовано |
| --- | --- |
| HTTP-клієнт: URL із `VITE_API_URL`, перевірка `response.ok`, `ApiError` | `src/api/httpClient.ts`, `src/api/ApiError.ts`, `src/config/env.ts` |
| Repository: `getAll`, `getById`, `create`, `update`, `delete` + mapping `ApiTodo → Task` | `src/repositories/taskRepository.ts` |
| Пагінація (`limit` / `skip`), номер сторінки | `src/hooks/useTaskList.ts`, `src/components/Pagination.tsx` |
| Скасування GET (`AbortController`) для списку | `src/hooks/useTaskList.ts` (cleanup в `useEffect`) |
| Скасування GET для деталей | `src/hooks/useTaskDetails.ts` |
| Скасований запит не є «помилкою завантаження» | `isAbortError` у `ApiError.ts`, перевірка в обох хуках |
| loading / error / empty / success | `src/components/StatePanel.tsx`, `TaskList.tsx`, `Toast.tsx` |
| Повтор після помилки | кнопка «Спробувати ще» (`retry` у хуках) |
| Деталі через `GET /todos/:id` | `TaskDetails.tsx` + `useTaskDetails.ts` |
| Створення, редагування назви, `completed`, видалення з підтвердженням | `useTaskMutations.ts`, `TaskForm.tsx`, `TaskItem.tsx` |
| Server state ≠ client/UI state | server — `useTaskList` + `taskListReducer`; UI — `PlannerPage` (пошук, фільтр, форма, вибране завдання), `ToastContext` |
| Без `alert` / `confirm` | inline-підтвердження в `TaskItem`, toast-повідомлення |

### Додаткові завдання (виконано)

- Пошук із debounce — `useDebouncedValue` + `GET /todos/search`.
- Optimistic update для `completed` з відкатом при помилці — `useTaskMutations.toggleTask`.
- Централізована нормалізація помилок — `getErrorMessage` / `ApiError`.

## Рішення, які варто пояснити на захисті

- **DummyJSON не зберігає записи.** Тому після POST/PATCH/DELETE hook сам оновлює state (за умовою лабораторної). Додатково `sessionOverlay.ts` тримає результат записів **у пам'яті на час сесії**: нове завдання не зникає при перемиканні сторінок, його можна відкрити, змінити, видалити (сервер не знає його id, тому для таких завдань HTTP-запит не надсилається). Це не localStorage і не власний backend — після перезавантаження все скидається.
- DummyJSON на кожен POST повертає той самий `id`, тому `sessionOverlay` гарантує унікальність id.
- `description`, `priority`, `category` у DummyJSON немає — це client-only metadata в `localStorage` (`taskMetaStorage.ts`). Самі завдання (server state) у `localStorage` **не** зберігаються. Збереженим лишається також фільтр (UI state).
- Context із лаби №9 залишився лише для toast (UI state). Server state у `TaskContext` не переносився; `useLocalStorage` збережено для фільтра.
- Із лаби №9 прибрано `taskReducer`, undoable delete та «Очистити виконані / Скинути дані» — вони були прив'язані до локального сховища як джерела правди.
- Кнопки пагінації не блокуються під час завантаження: швидкі кліки скасовують попередній запит (`controller.abort()`), а `AbortError` ігнорується.
- Сторінка «прив'язана» до пошукового запиту (`pageState.query === query`), тому новий запит повертає на сторінку 1 без зайвого Effect.
- Фільтр «Усі / Активні / Виконані» застосовується до завдань поточної сторінки (DummyJSON не має такого фільтра в `/todos`).

## Відповіді на контрольні запитання (коротко)

1. **REST API** — стиль HTTP-API, де ресурси мають URL, а дії виражаються методами HTTP; сервер без стану, відповіді зазвичай JSON.
2. **GET** читає, **POST** створює, **PUT** замінює ресурс повністю, **PATCH** змінює частково, **DELETE** видаляє.
3. Компонент відповідає за відображення; HTTP-деталі (URL, заголовки, помилки) змінюються окремо, дублюються й ускладнюють тестування.
4. **Repository** — об'єкт, що надає доступ до даних як до колекції доменних об'єктів і приховує джерело та формат.
5. Тут repository знає endpoint-и, перетворює `ApiTodo ↔ Task` і приховує симуляцію запису.
6. **API client** — транспорт (запит, статус, JSON, помилки), не знає про предметну область; **repository** — знає, які endpoint-и та моделі відповідають `Task`.
7. loading, success, error, empty (та скасування).
8. **Server state** — копія даних сервера (асинхронна, може застаріти); **client/UI state** — те, що існує лише в інтерфейсі (фільтр, форма, вибране).
9. Виникає друге джерело правди: дані розходяться з сервером і застарівають.
10. Щоб скасувати запит, який більше не потрібен (нова сторінка, закриття компонента), і не обробляти застарілу відповідь.
11. Без cleanup відповідь прийде після unmount і спробує оновити state / спричинить гонку; тому в cleanup викликаємо `abort()`.
12. `fetch` вбудований, не кидає помилку на 4xx/5xx, JSON парситься вручну; Axios кидає на не-2xx, має interceptors, `baseURL`, автоматичний JSON.
13. Інтерфейс оновлюється одразу, до відповіді сервера, а при помилці зміна відкочується.
14. Достатньо оновити state (додати запис у список) — сторінка не втрачає стан, швидше і без блимання.
15. Перевірити `response.ok` / статус, кинути типізовану помилку, на верхньому рівні показати зрозуміле повідомлення й дати повторити.

## Рекомендовані коміти

```text
git switch -c feature/rest-api
feat(lab-10): add http client and api error handling
feat(lab-10): add task repository with DTO mapping
feat(lab-10): load tasks with pagination and abortable requests
feat(lab-10): add task details, create, update and delete via repository
feat(lab-10): add search with debounce and optimistic toggle
docs(lab-10): add readme
```
