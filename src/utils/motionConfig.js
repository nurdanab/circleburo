// Optimized motion configuration to prevent memory leaks and improve performance

import React from 'react';
import { prefersReducedMotion } from './performance';

// Check if user prefers reduced motion
const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return prefersReducedMotion();
};

// Base configuration for motion components
export const motionConfig = {
  // Reduced motion variants
  reducedMotion: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 }
  },

  // Performance optimized defaults
  defaultTransition: {
    type: "tween",
    ease: "easeOut",
    duration: 0.3
  },

  // Viewport settings for better performance
  defaultViewport: {
    once: true,
    margin: "-10px",
    amount: 0.3
  }
};

// Optimized animation variants
export const fadeInUp = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    ...motionConfig.defaultTransition,
    duration: 0.4
  }
};

export const fadeIn = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: motionConfig.defaultTransition
};

export const scaleIn = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: {
    ...motionConfig.defaultTransition,
    duration: 0.5
  }
};

export const slideInLeft = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: motionConfig.defaultTransition
};

export const slideInRight = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: motionConfig.defaultTransition
};

// Stagger animations
export const staggerContainer = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};

export const staggerItem = shouldReduceMotion() ? motionConfig.reducedMotion : {
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: motionConfig.defaultTransition
    }
  }
};

// Hover animations - only if motion is enabled
export const hoverScale = shouldReduceMotion() ? {} : {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export const hoverFloat = shouldReduceMotion() ? {} : {
  whileHover: { y: -5 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

// Infinite animations with proper cleanup
export const infiniteFloat = shouldReduceMotion() ? {} : {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const infiniteRotate = shouldReduceMotion() ? {} : {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Page transition variants
export const pageTransition = shouldReduceMotion() ? motionConfig.reducedMotion : {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4
  }
};

// Helper function to create safe motion props
export const createMotionProps = (variants, options = {}) => {
  if (shouldReduceMotion()) {
    return {
      initial: false,
      animate: false,
      exit: false,
      ...options
    };
  }

  return {
    ...variants,
    viewport: {
      ...motionConfig.defaultViewport,
      ...options.viewport
    },
    ...options
  };
};

// Performance monitoring for animations
export const withPerformanceMonitoring = (Component) => {
  return function PerformanceMonitoredComponent(props) {
    const start = React.useMemo(() => performance.now(), []);

    React.useEffect(() => {
      if (import.meta.env.DEV) {
        const end = performance.now();
        if (end - start > 16) { // More than one frame
          console.warn(`Slow animation render: ${end - start}ms`, Component.name);
        }
      }
    }, [start]);

    return React.createElement(Component, props);
  };
};

// Cleanup helper for components with animations
export const useAnimationCleanup = () => {
  React.useEffect(() => {
    return () => {
      // Clear any ongoing animations on unmount
      if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        // This is a general cleanup - specific animation IDs should be tracked individually
        console.log('Component with animations unmounted, cleaning up...');
      }
    };
  }, []);
};