"use client";

import * as React from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import "./toast.css";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  toast: {
    (options: Omit<Toast, "id">): string;
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
  };
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(() => {
    // Create the toast function with all methods as properties
    // Using Object.assign to avoid mutation warnings from React compiler
    return Object.assign((options: Omit<Toast, "id">) => addToast(options), {
      success: (title: string, description?: string) =>
        addToast({ title, description, variant: "success" }),
      error: (title: string, description?: string) =>
        addToast({ title, description, variant: "error" }),
      warning: (title: string, description?: string) =>
        addToast({ title, description, variant: "warning" }),
      info: (title: string, description?: string) =>
        addToast({ title, description, variant: "info" }),
    });
  }, [addToast]);

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast, toast }),
    [toasts, addToast, removeToast, toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Extracted to module level to avoid "creating components during render" warning
function ToastIcon({ variant }: { variant?: ToastVariant }) {
  switch (variant) {
    case "success":
      return (
        <div className="toast-icon toast-icon-success">
          <CheckCircle className="w-5 h-5" />
        </div>
      );
    case "error":
      return (
        <div className="toast-icon toast-icon-error">
          <XCircle className="w-5 h-5" />
        </div>
      );
    case "warning":
      return (
        <div className="toast-icon toast-icon-warning">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    case "info":
      return (
        <div className="toast-icon toast-icon-info">
          <Info className="w-5 h-5" />
        </div>
      );
    default:
      return null;
  }
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  return (
    <div
      className={`toast toast-${toast.variant || "default"} ${isExiting ? "toast-exiting" : ""}`}
      role="alert"
    >
      <ToastIcon variant={toast.variant} />

      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        {toast.description && (
          <div className="toast-description">{toast.description}</div>
        )}
        {toast.action && (
          <div className="toast-action">
            <button
              type="button"
              className="toast-action-button"
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="toast-close-icon" />
      </button>
    </div>
  );
}
