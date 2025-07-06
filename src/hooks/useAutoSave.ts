import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';

interface UseAutoSaveOptions {
  delay?: number; // Debounce delay in milliseconds
  onSave?: (data: Partial<UserProfile>) => void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

interface UseAutoSaveReturn {
  saveData: (data: Partial<UserProfile>) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export const useAutoSave = ({
  delay = 2000,
  onSave,
  onError,
  onSuccess
}: UseAutoSaveOptions = {}): UseAutoSaveReturn => {
  const { updateUserProfile } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);
  const errorRef = useRef<string | null>(null);

  const saveData = useCallback(async (data: Partial<UserProfile>) => {
    try {
      isSavingRef.current = true;
      errorRef.current = null;
      
      await updateUserProfile(data);
      
      lastSavedRef.current = new Date();
      onSuccess?.();
      onSave?.(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save';
      errorRef.current = errorMessage;
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      isSavingRef.current = false;
    }
  }, [updateUserProfile, onSave, onError, onSuccess]);

  const debouncedSave = useCallback((data: Partial<UserProfile>) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveData(data);
    }, delay);
  }, [saveData, delay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    saveData: debouncedSave,
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
    error: errorRef.current
  };
};