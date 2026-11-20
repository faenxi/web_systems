import './Stats.scss';

interface StatsProps {
  /** Загальна кількість завдань на сервері. */
  total: number;
  /** Активні та виконані — у межах поточної сторінки. */
  active: number;
  completed: number;
}

export function Stats({ total, active, completed }: StatsProps) {
  return (
    <dl className="stats" aria-label="Статистика">
      <div className="stats__item">
        <dt className="stats__label">Усього</dt>
        <dd className="stats__value">{total}</dd>
      </div>
      <div className="stats__item stats__item--accent">
        <dt className="stats__label">Активні (на сторінці)</dt>
        <dd className="stats__value">{active}</dd>
      </div>
      <div className="stats__item">
        <dt className="stats__label">Виконані (на сторінці)</dt>
        <dd className="stats__value">{completed}</dd>
      </div>
    </dl>
  );
}
