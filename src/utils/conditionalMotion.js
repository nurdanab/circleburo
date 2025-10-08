// src/utils/conditionalMotion.js
// ОПТИМИЗАЦИЯ: Условная загрузка Framer Motion только на десктопе с хорошим соединением

let motionCache = null;

/**
 * Определяет, нужно ли использовать анимации
 */
export const shouldUseAnimations = () => {
  // Проверка на мобильное устройство
  const isMobile = window.innerWidth < 768;
  if (isMobile) return false;

  // Проверка предпочтений пользователя
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;

  // Проверка скорости соединения
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    const slowConnection = connection.effectiveType === 'slow-2g' ||
                          connection.effectiveType === '2g' ||
                          connection.saveData;
    if (slowConnection) return false;
  }

  return true;
};

/**
 * Возвращает Framer Motion или статические компоненты в зависимости от условий
 */
export const getMotion = async () => {
  if (motionCache) {
    return motionCache;
  }

  if (!shouldUseAnimations()) {
    // Возвращаем простые HTML элементы без анимаций
    const staticMotion = {
      div: 'div',
      section: 'section',
      button: 'button',
      span: 'span',
      h1: 'h1',
      h2: 'h2',
      p: 'p',
      AnimatePresence: ({ children }) => children,
      useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
      useTransform: () => ({ get: () => 0 }),
      useReducedMotion: () => true,
    };

    motionCache = staticMotion;
    return staticMotion;
  }

  // Загружаем Framer Motion динамически
  try {
    const framerMotion = await import('framer-motion');
    motionCache = framerMotion;
    return framerMotion;
  } catch (error) {
    console.warn('Failed to load framer-motion, using static components:', error);
    // Fallback на статические компоненты
    const staticMotion = {
      div: 'div',
      section: 'section',
      button: 'button',
      span: 'span',
      h1: 'h1',
      h2: 'h2',
      p: 'p',
      AnimatePresence: ({ children }) => children,
      useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
      useTransform: () => ({ get: () => 0 }),
      useReducedMotion: () => true,
    };

    motionCache = staticMotion;
    return staticMotion;
  }
};

/**
 * React hook для использования условного motion
 */
export const useConditionalMotion = () => {
  const [motion, setMotion] = React.useState(null);

  React.useEffect(() => {
    getMotion().then(setMotion);
  }, []);

  return motion;
};
