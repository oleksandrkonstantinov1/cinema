import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ── Module-level event bus ─────────────────────────────────────────────────
const listeners = new Set();
let _id = 0;

function emit(message, type) {
  const id = ++_id;
  listeners.forEach((fn) => fn({ id, message, type }));
  return id;
}

export const toast = {
  success: (msg) => emit(msg, 'success'),
  error:   (msg) => emit(msg, 'error'),
  info:    (msg) => emit(msg, 'info'),
};

// ── Toast item component ───────────────────────────────────────────────────
const TYPE_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-destructive/10 border-destructive/30 text-destructive',
  info:    'bg-card border-border text-foreground',
};

const TYPE_ICONS = { success: '✓', error: '✕', info: 'ℹ' };

function ToastItem({ toast: t, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 4000);
    return () => clearTimeout(timer);
  }, [t.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md text-sm max-w-sm w-full animate-in slide-in-from-right-full ${TYPE_STYLES[t.type]}`}
    >
      <span className="font-bold mt-0.5 shrink-0">{TYPE_ICONS[t.type]}</span>
      <span className="flex-1 leading-snug">{t.message}</span>
      <button
        onClick={() => onRemove(t.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ── Toaster (mount once in main.jsx) ──────────────────────────────────────
export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => setToasts((prev) => [...prev, t]);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>,
    document.body
  );
}
