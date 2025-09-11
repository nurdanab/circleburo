// src/analytics.js
const TRACKING_ID = 'G-29PQZ4K7ZP';

let ReactGA = null;
let isInitialized = false;

// Polyfill for requestIdleCallback
const requestIdleCallbackPolyfill = (callback) => {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(callback);
  }
  return setTimeout(callback, 100);
};

// Асинхронная загрузка аналитики
const loadGA = async () => {
  if (!ReactGA) {
    try {
      const module = await import('react-ga4');
      ReactGA = module.default;
    } catch (error) {
      console.warn('Failed to load analytics:', error);
    }
  }
  return ReactGA;
};

export const initGA = async () => {
  if (isInitialized) return;
  
  // Отложенная инициализация
  requestIdleCallbackPolyfill(async () => {
    const GA = await loadGA();
    if (GA) {
      GA.initialize(TRACKING_ID);
      isInitialized = true;
    }
  });
};

export const logPageView = async () => {
  const GA = await loadGA();
  if (GA && isInitialized) {
    GA.send({ hitType: 'pageview', page: window.location.pathname });
  }
};