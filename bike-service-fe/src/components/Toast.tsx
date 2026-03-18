import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
};

const ACCENT_COLORS = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  info: 'var(--accent-blue)',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast-item card-elevated">
          <div className="toast-accent" style={{ background: ACCENT_COLORS[toast.type] }} />
          <div className="toast-icon" style={{ color: ACCENT_COLORS[toast.type] }}>
            {ICONS[toast.type]}
          </div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
          <div className="toast-progress" style={{ background: ACCENT_COLORS[toast.type] }} />
        </div>
      ))}
    </div>
  );
}
