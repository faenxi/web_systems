import './Pagination.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}

/** Кнопки не блокуються під час завантаження: швидкий перехід скасовує попередній запит. */
export function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Пагінація">
      <button
        className="pagination__button"
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Назад
      </button>
      <span className="pagination__info" aria-live="polite">
        Сторінка {page} з {totalPages} · завдань: {total}
      </span>
      <button
        className="pagination__button"
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Далі →
      </button>
    </nav>
  );
}
