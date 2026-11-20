import './StatePanel.scss';
import { cx } from '../utils/cx';

interface StatePanelProps {
  kind: 'loading' | 'error' | 'empty';
  message: string;
  detail?: string;
  onRetry?: () => void;
}

/** Єдиний вигляд loading / error / empty станів для списку та деталей. */
export function StatePanel({ kind, message, detail, onRetry }: StatePanelProps) {
  return (
    <div
      className={cx('state-panel', `state-panel--${kind}`)}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {kind === 'loading' && <span className="state-panel__spinner" aria-hidden="true" />}
      <p className="state-panel__message">{message}</p>
      {detail && <p className="state-panel__detail">{detail}</p>}
      {onRetry && (
        <button className="state-panel__button" type="button" onClick={onRetry}>
          Спробувати ще
        </button>
      )}
    </div>
  );
}
