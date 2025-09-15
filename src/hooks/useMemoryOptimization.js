// Hook for preventing memory leaks and optimizing performance

import { useEffect, useRef, useCallback, useState } from 'react';

// Hook to prevent memory leaks from event listeners
export const useEventListener = (event, handler, element = window, options = {}) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element?.addEventListener) return;

    const eventListener = (event) => savedHandler.current(event);

    element.addEventListener(event, eventListener, options);

    return () => {
      element.removeEventListener(event, eventListener, options);
    };
  }, [event, element, options.capture, options.once, options.passive]);
};

// Hook to cleanup timeouts and intervals
export const useCleanupTimer = () => {
  const timersRef = useRef(new Set());

  const createTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      callback();
    }, delay);

    timersRef.current.add(id);
    return id;
  }, []);

  const createInterval = useCallback((callback, delay) => {
    const id = setInterval(callback, delay);
    timersRef.current.add(id);
    return id;
  }, []);

  const clearTimer = useCallback((id) => {
    clearTimeout(id);
    clearInterval(id);
    timersRef.current.delete(id);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      // Clear all timers on unmount
      timers.forEach(id => {
        clearTimeout(id);
        clearInterval(id);
      });
      timers.clear();
    };
  }, []);

  return { createTimeout, createInterval, clearTimer };
};

// Hook to cleanup async operations
export const useAsyncCleanup = () => {
  const pendingPromises = useRef(new Set());
  const abortControllers = useRef(new Set());

  const createAbortablePromise = useCallback((promiseFactory) => {
    const controller = new AbortController();
    abortControllers.current.add(controller);

    const promise = promiseFactory(controller.signal)
      .finally(() => {
        abortControllers.current.delete(controller);
        pendingPromises.current.delete(promise);
      });

    pendingPromises.current.add(promise);
    return promise;
  }, []);

  const createCancellablePromise = useCallback((promise) => {
    let cancelled = false;

    const cancellablePromise = promise.then(
      value => cancelled ? Promise.reject({ cancelled: true }) : value,
      error => cancelled ? Promise.reject({ cancelled: true }) : Promise.reject(error)
    );

    pendingPromises.current.add(cancellablePromise);

    cancellablePromise.cancel = () => {
      cancelled = true;
      pendingPromises.current.delete(cancellablePromise);
    };

    return cancellablePromise;
  }, []);

  useEffect(() => {
    const controllers = abortControllers.current;
    const promises = pendingPromises.current;

    return () => {
      // Abort all ongoing requests
      controllers.forEach(controller => {
        controller.abort();
      });
      controllers.clear();

      // Cancel all pending promises
      promises.forEach(promise => {
        if (promise.cancel) {
          promise.cancel();
        }
      });
      promises.clear();
    };
  }, []);

  return { createAbortablePromise, createCancellablePromise };
};

// Hook to prevent excessive re-renders
export const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Hook for debouncing values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook to monitor memory usage (development only)
export const useMemoryMonitor = (componentName) => {
  useEffect(() => {
    if (!import.meta.env.DEV || !performance.memory) return;

    const checkMemory = () => {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;

      if (usedJSHeapSize > jsHeapSizeLimit * 0.8) {
        console.warn(
          `High memory usage detected in ${componentName}:`,
          `${Math.round(usedJSHeapSize / 1048576)}MB / ${Math.round(jsHeapSizeLimit / 1048576)}MB`
        );
      }
    };

    checkMemory(); // Initial check
    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [componentName]);
};

// Hook for intersection observer with cleanup
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px',
      ...options
    });

    observerRef.current.observe(targetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options.threshold, options.rootMargin, options.root]);

  return targetRef;
};

// Combined hook for all memory optimizations
export const useMemoryOptimization = (componentName) => {
  const timers = useCleanupTimer();
  const async = useAsyncCleanup();

  useMemoryMonitor(componentName);

  return {
    ...timers,
    ...async,
    useEventListener,
    useThrottle,
    useDebounce,
    useIntersectionObserver
  };
};