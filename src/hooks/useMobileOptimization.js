// src/hooks/useMobileOptimization.js
import { useState, useEffect, useMemo } from 'react';
import { getConnectionInfo, shouldDisableHeavyAnimations } from '../utils/networkDetection';

/**
 * Hook для оптимизации контента на мобильных устройствах
 * @returns {Object} Настройки оптимизации
 */
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // Определяем тип устройства
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    // Получаем информацию о соединении
    const updateConnectionInfo = () => {
      setConnectionInfo(getConnectionInfo());
    };

    checkDevice();
    updateConnectionInfo();

    // Слушаем изменения размера окна
    window.addEventListener('resize', checkDevice);

    // Слушаем изменения соединения
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('resize', checkDevice);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  // Мемоизированные настройки оптимизации
  const optimization = useMemo(() => {
    const isSlowConnection = connectionInfo?.slow || false;
    const saveData = connectionInfo?.saveData || false;

    return {
      // Базовая информация
      isMobile,
      isSlowConnection,
      saveData,
      connectionType: connectionInfo?.effectiveType || 'unknown',

      // Настройки для контента
      shouldLoadVideo: !isSlowConnection && !saveData,
      shouldLoadHighResImages: !isMobile && !isSlowConnection && !saveData,
      shouldUseHeavyAnimations: !shouldDisableHeavyAnimations() && !isMobile,
      shouldPreloadAssets: !isMobile && !isSlowConnection,

      // Настройки для анимаций
      animationDuration: isMobile ? 0.3 : 0.6,
      animationDistance: isMobile ? 10 : 30,
      staggerDelay: isMobile ? 0.05 : 0.15,

      // Настройки для изображений
      imageQuality: (() => {
        if (saveData || isSlowConnection) return 'low';
        if (isMobile) return 'medium';
        return 'high';
      })(),

      // Лимиты
      maxImageSize: isMobile ? 800 : 1920,
      lazyLoadMargin: isMobile ? '50px' : '100px',
      priorityLoadCount: isMobile ? 2 : 4,
    };
  }, [isMobile, connectionInfo]);

  return optimization;
};

/**
 * Hook для адаптивной загрузки ресурсов
 * @param {string} resource - Тип ресурса ('image', 'video', 'font')
 * @returns {boolean} Должен ли ресурс быть загружен
 */
export const useShouldLoadResource = (resource) => {
  const optimization = useMobileOptimization();

  return useMemo(() => {
    switch (resource) {
      case 'video':
        return optimization.shouldLoadVideo;
      case 'highResImage':
        return optimization.shouldLoadHighResImages;
      case 'animation':
        return optimization.shouldUseHeavyAnimations;
      case 'prefetch':
        return optimization.shouldPreloadAssets;
      default:
        return true;
    }
  }, [resource, optimization]);
};

/**
 * Hook для получения оптимального размера изображения
 * @param {Object} sizes - Объект с размерами {mobile, tablet, desktop}
 * @returns {string} Оптимальный путь к изображению
 */
export const useOptimalImageSize = (sizes) => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return useMemo(() => {
    if (width < 768 && sizes.mobile) return sizes.mobile;
    if (width < 1024 && sizes.tablet) return sizes.tablet;
    return sizes.desktop || sizes.tablet || sizes.mobile;
  }, [width, sizes]);
};

export default useMobileOptimization;
