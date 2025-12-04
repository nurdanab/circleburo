// src/utils/breakpoints.js
// Унифицированная утилита для работы с breakpoints

import { useMediaQuery } from 'react-responsive';

/**
 * Константы breakpoints для всего проекта
 * Должны соответствовать breakpoints в CSS (index.css)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1536
};

/**
 * Хук для определения текущего размера экрана
 * Возвращает объект с флагами для каждого типа устройства
 *
 * @returns {Object} { isMobile, isTablet, isDesktop }
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoint();
 * if (isMobile) {
 *   // Код для мобильных устройств
 * }
 */
export const useBreakpoint = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.mobile });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS.mobile + 1,
    maxWidth: BREAKPOINTS.tablet
  });
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.tablet + 1 });

  return { isMobile, isTablet, isDesktop };
};

/**
 * Проверка на мобильное устройство (синхронная)
 * Используется в useGSAP или других местах, где нужна синхронная проверка
 *
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= BREAKPOINTS.mobile;
};

/**
 * Проверка на планшет (синхронная)
 *
 * @returns {boolean}
 */
export const isTabletDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > BREAKPOINTS.mobile && window.innerWidth <= BREAKPOINTS.tablet;
};

/**
 * Проверка на десктоп (синхронная)
 *
 * @returns {boolean}
 */
export const isDesktopDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > BREAKPOINTS.tablet;
};

/**
 * Получить текущий тип устройства (синхронная)
 *
 * @returns {'mobile' | 'tablet' | 'desktop'}
 */
export const getDeviceType = () => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};
