import { useCallback, useEffect, useRef } from "react";

interface UseDebounceOptions {
  onDebounce?: () => void;
  onCancel?: () => void;
}

export function useDebounce<F extends (...args: Parameters<F>) => Promise<void>>(
  func: F,
  delay?: number,
  options?: UseDebounceOptions
): (...args: Parameters<F>) => Promise<void> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const promiseResolveRef = useRef<(() => void) | null>(null);

  const cancelPending = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      options?.onCancel?.();
      // Resolve any pending promise
      if (promiseResolveRef.current) {
        promiseResolveRef.current();
        promiseResolveRef.current = null;
      }
    }
  }, [options]);

  useEffect(() => {
    // Cleanup on unmount
    return () => cancelPending();
  }, [cancelPending]);

  return useCallback(
    (...args: Parameters<F>) => {
      // If no delay, execute immediately
      if (!delay) {
        return func(...args);
      }

      // Cancel any pending debounce
      cancelPending();
      
      // Signal that we're starting a new debounce
      options?.onDebounce?.();

      return new Promise<void>((resolve) => {
        promiseResolveRef.current = resolve;
        timeoutRef.current = setTimeout(async () => {
          await func(...args);
          promiseResolveRef.current = null;
          resolve();
        }, delay);
      });
    },
    [func, delay, options, cancelPending]
  );
}
