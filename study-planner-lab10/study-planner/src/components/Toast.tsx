import './Toast.scss';
import { useToast } from '../hooks/useToast';
import { cx } from '../utils/cx';

/** Короткі success / error повідомлення замість alert. */
export function ToastHost() {
  const { toast } = useToast();

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={cx('toast', `toast--${toast.kind}`)}>
          <span className="toast__message">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
