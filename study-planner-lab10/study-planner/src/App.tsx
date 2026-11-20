import { ToastHost } from './components/Toast';
import { ToastProvider } from './context/ToastProvider';
import { PlannerPage } from './pages/PlannerPage';

export default function App() {
  return (
    <ToastProvider>
      <PlannerPage />
      <ToastHost />
    </ToastProvider>
  );
}
