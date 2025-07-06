'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastType } from '@/components/ui/Toast';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
  showLoading: (title: string, message?: string) => string;
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, [generateId]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id'>>) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    return showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    return showToast({ type: 'error', title, message, duration: 7000 });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    return showToast({ type: 'warning', title, message, duration: 6000 });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    return showToast({ type: 'info', title, message });
  }, [showToast]);

  const showLoading = useCallback((title: string, message?: string) => {
    return showToast({ type: 'loading', title, message, duration: 0 }); // No auto-close for loading
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

// Convenience hooks for common toast patterns
export const useAutoSaveToast = () => {
  const { showLoading, showSuccess, showError, hideToast, updateToast } = useToast();

  const showSaving = useCallback(() => {
    return showLoading('Saving...', 'Your changes are being saved');
  }, [showLoading]);

  const showSaved = useCallback((toastId?: string) => {
    if (toastId) {
      updateToast(toastId, {
        type: 'success',
        title: 'Saved',
        message: 'Your changes have been saved successfully',
        duration: 3000
      });
      // Auto-hide after duration
      setTimeout(() => hideToast(toastId), 3000);
    } else {
      showSuccess('Saved', 'Your changes have been saved successfully');
    }
  }, [updateToast, hideToast, showSuccess]);

  const showSaveError = useCallback((error: string, toastId?: string) => {
    if (toastId) {
      updateToast(toastId, {
        type: 'error',
        title: 'Save Failed',
        message: error,
        duration: 7000
      });
      // Auto-hide after duration
      setTimeout(() => hideToast(toastId), 7000);
    } else {
      showError('Save Failed', error);
    }
  }, [updateToast, hideToast, showError]);

  return {
    showSaving,
    showSaved,
    showSaveError
  };
};