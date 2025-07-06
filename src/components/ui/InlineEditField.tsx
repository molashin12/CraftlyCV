'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X, Loader2 } from 'lucide-react';
import { useInlineEdit } from '@/hooks/useInlineEdit';

interface InlineEditFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  validate?: (value: string) => string | null;
  className?: string;
  inputClassName?: string;
  displayClassName?: string;
  autoSave?: boolean;
  saveDelay?: number;
  maxLength?: number;
  type?: 'text' | 'email' | 'url' | 'tel';
  label?: string;
  required?: boolean;
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  value,
  onSave,
  placeholder = 'Click to edit...',
  multiline = false,
  validate,
  className = '',
  inputClassName = '',
  displayClassName = '',
  autoSave = true,
  saveDelay = 2000,
  maxLength,
  type = 'text',
  label,
  required = false
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const {
    value: editValue,
    isEditing,
    error,
    isSaving,
    startEdit,
    cancelEdit,
    saveEdit,
    updateValue
  } = useInlineEdit({
    initialValue: value,
    onSave,
    validate,
    autoSave,
    saveDelay
  });

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text' || type === 'email' || type === 'url' || type === 'tel') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveEdit();
    }
  };

  const displayValue = value || placeholder;
  const isEmpty = !value;

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    const inputProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateValue(e.target.value),
      onKeyDown: handleKeyDown,
      onBlur: autoSave ? undefined : saveEdit,
      className: `w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${inputClassName}`,
      placeholder,
      maxLength,
      required,
      ...(multiline ? { rows: 3 } : { type })
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-blue-100">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <InputComponent {...inputProps} />
          
          {/* Action buttons for manual save mode */}
          {!autoSave && (
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={saveEdit}
                disabled={isSaving}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                <span>Save</span>
              </button>
              <button
                onClick={cancelEdit}
                disabled={isSaving}
                className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
          )}
          
          {/* Saving indicator for auto-save */}
          {autoSave && isSaving && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        
        {/* Auto-save hint */}
        {autoSave && (
          <p className="text-xs text-blue-300">
            {multiline ? 'Ctrl+Enter to save, Esc to cancel' : 'Enter to save, Esc to cancel'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-blue-100">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div
        className={`group relative cursor-pointer bg-white/10 border border-white/20 rounded-lg p-3 text-white hover:bg-white/15 transition-colors ${displayClassName}`}
        onClick={startEdit}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <span className={isEmpty ? 'text-blue-200 italic' : ''}>
            {displayValue}
          </span>
          
          {/* Edit icon */}
          <Edit2 
            className={`w-4 h-4 text-blue-300 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } group-hover:opacity-100`} 
          />
        </div>
        
        {/* Hover hint */}
        {isHovered && (
          <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            Click to edit
          </div>
        )}
      </div>
    </div>
  );
};