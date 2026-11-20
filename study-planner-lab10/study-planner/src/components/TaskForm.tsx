import { useState } from 'react';
import type { FormEvent } from 'react';
import './TaskForm.scss';
import { CATEGORIES, CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS } from '../data/labels';
import type { Category, Priority, Task, TaskDraft } from '../types/task';
import { cx } from '../utils/cx';

interface TaskFormProps {
  /** Завдання, яке редагується; null — режим створення. */
  task: Task | null;
  isSaving: boolean;
  /** Повертає true, якщо збереження пройшло успішно. */
  onSubmit: (draft: TaskDraft) => Promise<boolean>;
  onCancel: () => void;
}

/** Форма створення та редагування. Перемонтовується через key, тому початкові значення беруться без Effect. */
export function TaskForm({ task, isSaving, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [category, setCategory] = useState<Category>(task?.category ?? 'study');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft: TaskDraft = { title: title.trim(), description: description.trim(), priority, category };
    if (draft.title === '') {
      setError('Вкажіть назву завдання.');
      return;
    }
    setError(null);

    const saved = await onSubmit(draft);
    if (saved && !task) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('study');
    }
  };

  return (
    <form className={cx('task-form', task && 'task-form--editing')} onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">{task ? 'Редагування завдання' : 'Нове завдання'}</h2>

      <label className="task-form__field">
        <span className="task-form__label">Назва</span>
        <input
          className="task-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Наприклад, підготуватися до заліку"
          aria-invalid={error !== null}
          aria-describedby={error ? 'task-form-error' : undefined}
        />
        {error && (
          <span id="task-form-error" className="task-form__error" role="alert">
            {error}
          </span>
        )}
      </label>

      <label className="task-form__field">
        <span className="task-form__label">Опис</span>
        <textarea
          className="task-form__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="task-form__row">
        <label className="task-form__field">
          <span className="task-form__label">Пріоритет</span>
          <select
            className="task-form__input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="task-form__field">
          <span className="task-form__label">Категорія</span>
          <select
            className="task-form__input"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit" disabled={isSaving}>
          {isSaving ? 'Збереження…' : task ? 'Зберегти зміни' : 'Додати завдання'}
        </button>
        {task && (
          <button className="task-form__cancel" type="button" onClick={onCancel} disabled={isSaving}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
