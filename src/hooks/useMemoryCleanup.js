// Memory cleanup hook for preventing memory leaks
import { useEffect, useCallback, useRef } from 'react';

export const useMemoryCleanup = () => {
  const timeoutsRef = useRef(new Set());
  const intervalsRef = useRef(new Set());
  const abortControllersRef = useRef(new Set());

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => {
      clearTimeout(timeout);
    });
    timeoutsRef.current.clear();

    // Clear all intervals
    intervalsRef.current.forEach(interval => {
      clearInterval(interval);
    });
    intervalsRef.current.clear();

    // Abort all pending requests
    abortControllersRef.current.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    abortControllersRef.current.clear();
  }, []);

  // Safe setTimeout wrapper
  const safeSetTimeout = useCallback((callback, delay) => {
    const timeout = setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);
    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  // Safe setInterval wrapper
  const safeSetInterval = useCallback((callback, delay) => {
    const interval = setInterval(callback, delay);
    intervalsRef.current.add(interval);
    return interval;
  }, []);

  // Create AbortController for requests
  const createAbortController = useCallback(() => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    return controller;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    safeSetTimeout,
    safeSetInterval,
    createAbortController,
    cleanup
  };
};

export default useMemoryCleanup;