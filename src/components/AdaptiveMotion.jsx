// src/components/AdaptiveMotion.jsx
import React, { lazy, Suspense, useMemo } from 'react';
import { shouldDisableHeavyAnimations, shouldReduceMotion } from '../utils/networkDetection';

// Lazy load Framer Motion только когда нужно
const FramerMotion = lazy(() => import('framer-motion').then(module => ({
  default: {
    motion: module.motion,
    AnimatePresence: module.AnimatePresence
  }
})));

/**
 * Адаптивный компонент анимации
 * Использует Framer Motion на быстрых соединениях
 * Использует CSS анимации на медленных
 */
export const Motion = ({ children, animate, initial, exit, transition, className, style, ...props }) => {
  const shouldUseSimple = useMemo(() => {
    return shouldDisableHeavyAnimations() || shouldReduceMotion();
  }, []);

  // На медленных соединениях используем простой div
  if (shouldUseSimple) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  // На быстрых соединениях загружаем Framer Motion
  return (
    <Suspense fallback={<div className={className} style={style} {...props}>{children}</div>}>
      <FramerMotion>
        {({ motion }) => (
          <motion.div
            animate={animate}
            initial={initial}
            exit={exit}
            transition={transition}
            className={className}
            style={style}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </FramerMotion>
    </Suspense>
  );
};

/**
 * Адаптивный AnimatePresence
 */
export const AdaptiveAnimatePresence = ({ children, mode, ...props }) => {
  const shouldUseSimple = useMemo(() => {
    return shouldDisableHeavyAnimations() || shouldReduceMotion();
  }, []);

  // На медленных соединениях просто рендерим children
  if (shouldUseSimple) {
    return <>{children}</>;
  }

  // На быстрых соединениях используем AnimatePresence
  return (
    <Suspense fallback={<>{children}</>}>
      <FramerMotion>
        {({ AnimatePresence }) => (
          <AnimatePresence mode={mode} {...props}>
            {children}
          </AnimatePresence>
        )}
      </FramerMotion>
    </Suspense>
  );
};

/**
 * Hook для проверки, нужно ли использовать анимации
 */
export const useAnimationsEnabled = () => {
  return useMemo(() => {
    return !shouldDisableHeavyAnimations() && !shouldReduceMotion();
  }, []);
};

export default Motion;
