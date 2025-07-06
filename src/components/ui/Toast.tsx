'use client';

import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: Check,
  error: X,
  warning: AlertCircle,
  info: Info,
  loading: Loader2
};

const toastStyles = {
  success: 'bg-green-600 border-green-500',
  error: 'bg-red-600 border-red-500',
  warning: 'bg-yellow-600 border-yellow-500',
  info: 'bg-blue-600 border-blue-500',
  loading: 'bg-gray-600 border-gray-500'
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (type === 'loading') return; // Don't auto-close loading toasts

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match the exit animation duration
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${toastStyles[type]}
        border-l-4 rounded-lg shadow-lg backdrop-blur-sm
        max-w-sm w-full p-4 mb-3
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon 
            className={`w-5 h-5 text-white ${
              type === 'loading' ? 'animate-spin' : ''
            }`} 
          />
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-white">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-white/90 mt-1">
              {message}
            </p>
          )}
        </div>
        
        {type !== 'loading' && (
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};