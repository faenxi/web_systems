import './TaskList.scss';
import { StatePanel } from './StatePanel';
import { TaskItem } from './TaskItem';
import type { LoadStatus, Task } from '../types/task';

interface TaskListProps {
  status: LoadStatus;
  tasks: Task[];
  error: string | null;
  emptyMessage: string;
  selectedId: number | null;
  isPending: (id: number) => boolean;
  onRetry: () => void;
  onOpen: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskList({
  status,
  tasks,
  error,
  emptyMessage,
  selectedId,
  isPending,
  onRetry,
  onOpen,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (status === 'loading') {
    return <StatePanel kind="loading" message="Завантаження…" />;
  }

  if (status === 'error') {
    return (
      <StatePanel
        kind="error"
        message="Помилка завантаження."
        detail={error ?? undefined}
        onRetry={onRetry}
      />
    );
  }

  if (tasks.length === 0) {
    return <StatePanel kind="empty" message={emptyMessage} />;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          selected={task.id === selectedId}
          pending={isPending(task.id)}
          onOpen={onOpen}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
