import { useState, useCallback, useRef } from 'react';

interface OptimisticUpdateOptions<T> {
  onUpdate: (data: T) => Promise<void>;
  onError?: (error: Error, rollbackData: T) => void;
  onSuccess?: (data: T) => void;
}

interface OptimisticUpdateReturn<T> {
  data: T;
  isUpdating: boolean;
  error: string | null;
  updateOptimistically: (newData: T) => Promise<void>;
  setData: (data: T) => void;
}

export const useOptimisticUpdate = <T>(
  initialData: T,
  { onUpdate, onError, onSuccess }: OptimisticUpdateOptions<T>
): OptimisticUpdateReturn<T> => {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousDataRef = useRef<T>(initialData);

  const updateOptimistically = useCallback(async (newData: T) => {
    // Store the current data for potential rollback
    previousDataRef.current = data;
    
    // Optimistically update the UI
    setData(newData);
    setIsUpdating(true);
    setError(null);

    try {
      // Attempt to save the data
      await onUpdate(newData);
      
      // Update successful
      previousDataRef.current = newData;
      onSuccess?.(newData);
    } catch (err) {
      // Rollback on error
      setData(previousDataRef.current);
      
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      
      onError?.(err instanceof Error ? err : new Error(errorMessage), previousDataRef.current);
    } finally {
      setIsUpdating(false);
    }
  }, [data, onUpdate, onError, onSuccess]);

  return {
    data,
    isUpdating,
    error,
    updateOptimistically,
    setData
  };
};

// Specialized hook for profile updates
export const useOptimisticProfileUpdate = <T>(
  initialData: T,
  updateFunction: (data: Partial<T>) => Promise<void>
) => {
  return useOptimisticUpdate(initialData, {
    onUpdate: async (data: T) => {
      // Convert full data to partial for the update function
      await updateFunction(data as Partial<T>);
    },
    onError: (error, rollbackData) => {
      console.error('Profile update failed:', error);
      // Could show a toast notification here
    },
    onSuccess: (data) => {
      console.log('Profile updated successfully');
      // Could show a success toast here
    }
  });
};