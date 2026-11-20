import './FilterBar.scss';
import { FILTERS, FILTER_LABELS } from '../data/labels';
import type { Filter } from '../types/task';
import { cx } from '../utils/cx';

interface FilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

/** Фільтр — client/UI state; застосовується до завдань поточної сторінки. */
export function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Фільтр завдань на сторінці">
      {FILTERS.map((item) => (
        <button
          key={item}
          type="button"
          className={cx('filter-bar__button', filter === item && 'filter-bar__button--active')}
          aria-pressed={filter === item}
          onClick={() => onChange(item)}
        >
          {FILTER_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
