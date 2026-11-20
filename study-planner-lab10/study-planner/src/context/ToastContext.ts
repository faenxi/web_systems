import { createContext } from 'react';
import type { ToastKind, ToastMessage } from '../types/toast';

export interface ToastContextValue {
  toast: ToastMessage | null;
  notify: (message: string, kind?: ToastKind) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
