import { useEffect, useMemo, useState } from 'react';
import '../App.scss';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { Stats } from '../components/Stats';
import { TaskDetails } from '../components/TaskDetails';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { FILTER_STORAGE_KEY, SEARCH_DEBOUNCE_MS } from '../data/constants';
import { FILTERS } from '../data/labels';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTaskList } from '../hooks/useTaskList';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { Filter, Task, TaskDraft } from '../types/task';

const isFilter = (value: unknown): value is Filter => FILTERS.includes(value as Filter);

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: 'Завдань не знайдено.',
  active: 'Невиконаних завдань на цій сторінці немає.',
  completed: 'Виконаних завдань на цій сторінці немає.',
};

/**
 * Сторінка збирає разом:
 *  - server state (useTaskList) — дані з API;
 *  - client/UI state — пошуковий рядок, фільтр, форма редагування, вибране завдання.
 */
export function PlannerPage() {
  // ---- client/UI state ----
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useLocalStorage<Filter>(FILTER_STORAGE_KEY, 'all', isFilter);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsRefresh, setDetailsRefresh] = useState<Record<number, number>>({});

  // ---- server state ----
  const query = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const list = useTaskList(query);
  const mutations = useTaskMutations(list, {
    onChanged: (id) => setDetailsRefresh((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 })),
    onRemoved: (id) => {
      setSelectedId((current) => (current === id ? null : current));
      setEditingTask((current) => (current?.id === id ? null : current));
    },
  });

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return list.tasks.filter((task) => !task.completed);
    if (filter === 'completed') return list.tasks.filter((task) => task.completed);
    return list.tasks;
  }, [list.tasks, filter]);

  const completedOnPage = list.tasks.filter((task) => task.completed).length;
  const activeOnPage = list.tasks.length - completedOnPage;

  useEffect(() => {
    document.title = `Study Planner — сторінка ${list.page} з ${list.totalPages}`;
  }, [list.page, list.totalPages]);

  const handleSubmit = async (draft: TaskDraft): Promise<boolean> => {
    if (editingTask) {
      const saved = await mutations.updateTask(editingTask.id, draft);
      if (saved) setEditingTask(null);
      return saved;
    }
    const created = await mutations.createTask(draft);
    // Нове завдання має бути видно: скидаємо пошук (сторінку скидає useTaskList).
    if (created && search !== '') setSearch('');
    return created;
  };

  const emptyMessage = query !== '' ? 'За вашим запитом нічого не знайдено.' : EMPTY_MESSAGES[filter];

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Study Planner</h1>
        <p className="app__subtitle">Плануйте навчання та не губіть завдання.</p>
      </header>

      <div className="app__section">
        <Stats total={list.total} active={activeOnPage} completed={completedOnPage} />
      </div>

      <div className="app__section">
        <TaskForm
          key={editingTask?.id ?? 'new'}
          task={editingTask}
          isSaving={mutations.isSaving}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTask(null)}
        />
      </div>

      {selectedId !== null && (
        <div className="app__section">
          <TaskDetails
            key={selectedId}
            taskId={selectedId}
            refreshKey={detailsRefresh[selectedId] ?? 0}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}

      <div className="app__section app__toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar filter={filter} onChange={setFilter} />
      </div>

      <div className="app__section">
        <TaskList
          status={list.status}
          tasks={visibleTasks}
          error={list.error}
          emptyMessage={emptyMessage}
          selectedId={selectedId}
          isPending={mutations.isPending}
          onRetry={list.retry}
          onOpen={setSelectedId}
          onToggle={(task) => void mutations.toggleTask(task)}
          onEdit={setEditingTask}
          onDelete={(id) => void mutations.deleteTask(id)}
        />
      </div>

      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        total={list.total}
        onChange={list.setPage}
      />
    </main>
  );
}
