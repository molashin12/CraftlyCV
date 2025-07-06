import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInlineEditOptions<T> {
  initialValue: T;
  onSave: (value: T) => void;
  onCancel?: () => void;
  validate?: (value: T) => string | null;
  autoSave?: boolean;
  saveDelay?: number;
}

interface UseInlineEditReturn<T> {
  value: T;
  isEditing: boolean;
  error: string | null;
  isSaving: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  updateValue: (value: T) => void;
  setValue: (value: T) => void;
}

export const useInlineEdit = <T>({
  initialValue,
  onSave,
  onCancel,
  validate,
  autoSave = false,
  saveDelay = 1000
}: UseInlineEditOptions<T>): UseInlineEditReturn<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const originalValueRef = useRef<T>(initialValue);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update initial value when it changes externally
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
      originalValueRef.current = initialValue;
    }
  }, [initialValue, isEditing]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
    originalValueRef.current = value;
  }, [value]);

  const cancelEdit = useCallback(() => {
    setValue(originalValueRef.current);
    setIsEditing(false);
    setError(null);
    onCancel?.();
    
    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [onCancel]);

  const saveEdit = useCallback(async () => {
    // Validate if validator is provided
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      setIsSaving(true);
      setError(null);
      
      await onSave(value);
      
      setIsEditing(false);
      originalValueRef.current = value;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [value, validate, onSave]);

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    setError(null);

    // Auto-save functionality
    if (autoSave && isEditing) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        // Validate before auto-saving
        if (validate) {
          const validationError = validate(newValue);
          if (validationError) {
            setError(validationError);
            return;
          }
        }

        onSave(newValue);
        setIsEditing(false);
        originalValueRef.current = newValue;
      }, saveDelay);
    }
  }, [autoSave, isEditing, saveDelay, validate, onSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    isEditing,
    error,
    isSaving,
    startEdit,
    cancelEdit,
    saveEdit,
    updateValue,
    setValue
  };
};