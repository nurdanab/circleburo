// src/utils/networkDetection.js

/**
 * Определяет качество сетевого соединения пользователя
 * @returns {Object} Информация о соединении
 */
export const getConnectionInfo = () => {
  // Проверяем поддержку Network Information API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return {
      effectiveType: 'unknown',
      saveData: false,
      slow: false
    };
  }

  const effectiveType = connection.effectiveType || 'unknown';
  const saveData = connection.saveData || false;

  // Считаем соединение медленным если:
  // - effectiveType = 'slow-2g' или '2g'
  // - saveData включен пользователем
  // - RTT > 500ms
  const slow =
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    saveData ||
    (connection.rtt && connection.rtt > 500);

  return {
    effectiveType,
    saveData,
    slow,
    rtt: connection.rtt,
    downlink: connection.downlink
  };
};

/**
 * Проверяет, следует ли использовать упрощенную версию контента
 * @returns {boolean}
 */
export const shouldUseLightMode = () => {
  const { slow, saveData } = getConnectionInfo();
  return slow || saveData;
};

/**
 * Проверяет, следует ли отключить тяжелые анимации
 * @returns {boolean}
 */
export const shouldDisableHeavyAnimations = () => {
  const { effectiveType, saveData } = getConnectionInfo();

  // Отключаем тяжелые анимации на медленных соединениях
  return (
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    effectiveType === '3g' ||
    saveData
  );
};

/**
 * Проверяет, следует ли использовать prefers-reduced-motion
 * @returns {boolean}
 */
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Определяет оптимальное качество изображений
 * @returns {string} 'low' | 'medium' | 'high'
 */
export const getOptimalImageQuality = () => {
  const { effectiveType, saveData } = getConnectionInfo();

  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'low';
  }

  if (effectiveType === '3g') {
    return 'medium';
  }

  return 'high';
};

/**
 * Добавляет слушатель изменения сетевого соединения
 * @param {Function} callback
 * @returns {Function} Функция для отписки
 */
export const onConnectionChange = (callback) => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return () => {};
  }

  const handler = () => {
    callback(getConnectionInfo());
  };

  connection.addEventListener('change', handler);

  return () => {
    connection.removeEventListener('change', handler);
  };
};
