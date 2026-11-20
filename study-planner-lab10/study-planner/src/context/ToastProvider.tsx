import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './ToastContext';
import type { ToastContextValue } from './ToastContext';
import { TOAST_DURATION_MS } from '../data/constants';
import type { ToastKind, ToastMessage } from '../types/toast';

/** Context лишився лише для client/UI state — сповіщень. Server state тут немає. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const counter = useRef(0);

  const notify = useCallback((message: string, kind: ToastKind = 'success') => {
    counter.current += 1;
    setToast({ id: counter.current, message, kind });
  }, []);

  useEffect(() => {
    if (toast === null) return;
    const timerId = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [toast]);

  const value = useMemo<ToastContextValue>(() => ({ toast, notify }), [toast, notify]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
