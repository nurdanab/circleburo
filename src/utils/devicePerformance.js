/**
 * Device Performance Utility
 * Определяет оптимальные настройки GSAP анимаций на основе производительности устройства
 */

/**
 * Получает конфигурацию GSAP на основе производительности устройства
 * @returns {Object} Конфигурация с настройками анимаций
 */
export const getGSAPConfig = () => {
  // Проверяем различные показатели производительности
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Для слабых устройств или с настройкой reduced motion
  if (hasReducedMotion || (isMobile && isLowEndDevice)) {
    return {
      shouldPin: false,
      scrubValue: 1,
      maxImages: 12,
      shouldAnimate: false,
    };
  }

  // Для мобильных устройств
  if (isMobile) {
    return {
      shouldPin: true,
      scrubValue: 0.5,
      maxImages: 16,
      shouldAnimate: true,
    };
  }

  // Для десктопов
  return {
    shouldPin: true,
    scrubValue: 0.3,
    maxImages: 22,
    shouldAnimate: true,
  };
};

/**
 * Проверяет, поддерживает ли браузер WebP
 * @returns {Promise<boolean>}
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.width === 1);
    image.onerror = () => resolve(false);
    image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
};

/**
 * Определяет качество соединения
 * @returns {string} 'slow', 'medium', или 'fast'
 */
export const getConnectionQuality = () => {
  if (!navigator.connection) {
    return 'fast'; // По умолчанию предполагаем быстрое соединение
  }

  const connection = navigator.connection;
  const effectiveType = connection.effectiveType;

  if (effectiveType === '4g') {
    return 'fast';
  } else if (effectiveType === '3g') {
    return 'medium';
  } else {
    return 'slow';
  }
};

/**
 * Получает оптимальное количество изображений для загрузки
 * @returns {number}
 */
export const getOptimalImageCount = () => {
  const config = getGSAPConfig();
  const connectionQuality = getConnectionQuality();

  if (connectionQuality === 'slow') {
    return Math.min(config.maxImages, 10);
  }

  return config.maxImages;
};

export default {
  getGSAPConfig,
  supportsWebP,
  getConnectionQuality,
  getOptimalImageCount,
};
