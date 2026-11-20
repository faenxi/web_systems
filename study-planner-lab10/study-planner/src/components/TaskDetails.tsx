import './TaskDetails.scss';
import { StatePanel } from './StatePanel';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '../data/labels';
import { useTaskDetails } from '../hooks/useTaskDetails';
import { cx } from '../utils/cx';

interface TaskDetailsProps {
  taskId: number;
  /** Змінюється після редагування, щоб деталі завантажились заново. */
  refreshKey: number;
  onClose: () => void;
}

export function TaskDetails({ taskId, refreshKey, onClose }: TaskDetailsProps) {
  const { status, task, error, retry } = useTaskDetails(taskId, refreshKey);

  let content;
  if (status === 'error') {
    content = (
      <StatePanel kind="error" message="Не вдалося завантажити деталі." detail={error ?? undefined} onRetry={retry} />
    );
  } else if (task === null) {
    content = <StatePanel kind="loading" message="Завантаження деталей…" />;
  } else {
    content = (
      <dl className="task-details__list">
        <dt className="task-details__term">Назва</dt>
        <dd className="task-details__value">{task.title}</dd>
        <dt className="task-details__term">Опис</dt>
        <dd className="task-details__value">{task.description || '—'}</dd>
        <dt className="task-details__term">Категорія</dt>
        <dd className="task-details__value">{CATEGORY_LABELS[task.category]}</dd>
        <dt className="task-details__term">Пріоритет</dt>
        <dd className="task-details__value">{PRIORITY_LABELS[task.priority]}</dd>
        <dt className="task-details__term">Статус</dt>
        <dd className="task-details__value">{task.completed ? 'Виконано' : 'Активне'}</dd>
      </dl>
    );
  }

  return (
    <section
      className={cx('task-details', status === 'loading' && task !== null && 'task-details--busy')}
      aria-label="Деталі завдання"
    >
      <header className="task-details__header">
        <h2 className="task-details__title">Завдання #{taskId}</h2>
        <button className="task-details__close" type="button" onClick={onClose}>
          Закрити
        </button>
      </header>
      {content}
    </section>
  );
}
