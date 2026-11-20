import { useState } from 'react';
import './TaskItem.scss';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '../data/labels';
import type { Task } from '../types/task';
import { cx } from '../utils/cx';

interface TaskItemProps {
  task: Task;
  selected: boolean;
  pending: boolean;
  onOpen: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, selected, pending, onOpen, onToggle, onEdit, onDelete }: TaskItemProps) {
  // Підтвердження видалення — локальний UI state елемента (без alert / confirm).
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <li
      className={cx(
        'task-item',
        `task-item--${task.priority}`,
        task.completed && 'task-item--completed',
        selected && 'task-item--selected',
        pending && 'task-item--pending',
      )}
      aria-busy={pending}
    >
      <input
        className="task-item__checkbox"
        type="checkbox"
        checked={task.completed}
        disabled={pending}
        onChange={() => onToggle(task)}
        aria-label={`Виконано: ${task.title}`}
      />
      <div>
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className="task-item__badge">{PRIORITY_LABELS[task.priority]}</span>
          <span className="task-item__badge">{CATEGORY_LABELS[task.category]}</span>
        </div>
      </div>

      {confirmingDelete ? (
        <div className="task-item__actions" role="group" aria-label="Підтвердження видалення">
          <span className="task-item__confirm-text">Видалити завдання?</span>
          <button
            className="task-item__button task-item__button--danger"
            type="button"
            disabled={pending}
            onClick={() => {
              setConfirmingDelete(false);
              onDelete(task.id);
            }}
          >
            Так, видалити
          </button>
          <button className="task-item__button" type="button" onClick={() => setConfirmingDelete(false)}>
            Ні
          </button>
        </div>
      ) : (
        <div className="task-item__actions">
          <button className="task-item__button" type="button" onClick={() => onOpen(task.id)}>
            Деталі
          </button>
          <button className="task-item__button" type="button" disabled={pending} onClick={() => onEdit(task)}>
            Редагувати
          </button>
          <button
            className="task-item__button task-item__button--danger"
            type="button"
            disabled={pending}
            onClick={() => setConfirmingDelete(true)}
          >
            Видалити
          </button>
        </div>
      )}
    </li>
  );
}
