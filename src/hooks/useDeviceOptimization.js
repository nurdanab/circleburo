// src/hooks/useDeviceOptimization.js
import { useState, useEffect, useMemo } from 'react';

/**
 * Hook для определения возможностей устройства и оптимизации производительности
 * @returns {Object} - объект с информацией об устройстве и рекомендуемыми настройками
 */
export const useDeviceOptimization = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [connectionType, setConnectionType] = useState('4g');

  useEffect(() => {
    // Проверка типа устройства
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    // Проверка prefers-reduced-motion
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);

    // Проверка типа соединения
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      setConnectionType(connection.effectiveType || '4g');

      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || '4g');
      };

      connection.addEventListener('change', handleConnectionChange);
    }

    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkDevice, 150);
    };

    checkDevice();

    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionChange);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      }
      if (connection) {
        connection.removeEventListener('change', () => {});
      }
      clearTimeout(resizeTimer);
    };
  }, []);

  // Вычисляем оптимальные настройки производительности
  const performanceSettings = useMemo(() => {
    const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';
    const shouldReduceAnimations = prefersReducedMotion || isMobile || isSlowConnection;

    return {
      // Нужно ли использовать тяжелые анимации
      shouldAnimate: !shouldReduceAnimations,

      // Должны ли загружаться видео
      shouldLoadVideos: !isSlowConnection,

      // Должны ли использоваться сложные эффекты (blur, shadow и т.д.)
      shouldUseComplexEffects: !isMobile && !isSlowConnection,

      // Preload стратегия для изображений
      imageLoadStrategy: isMobile ? 'lazy' : 'eager',

      // Preload стратегия для видео
      videoPreload: isSlowConnection ? 'none' : (isMobile ? 'metadata' : 'auto'),

      // Длительность анимаций (в секундах)
      animationDuration: shouldReduceAnimations ? 0.2 : 0.5,

      // Задержка между анимациями (в секундах)
      animationStagger: shouldReduceAnimations ? 0.05 : 0.15,
    };
  }, [isMobile, isTablet, prefersReducedMotion, connectionType]);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    prefersReducedMotion,
    connectionType,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g',
    ...performanceSettings,
  };
};

export default useDeviceOptimization;
