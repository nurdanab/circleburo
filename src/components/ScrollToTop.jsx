// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для автоматической прокрутки страницы вверх при изменении маршрута
 * Это решает проблему, когда при переходе на новую страницу, она открывается не сверху
 */
function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    // Если в state есть scrollTo, значит это навигация к секции - пропускаем scroll to top
    if (state?.scrollTo) {
      return;
    }

    // Прокручиваем страницу вверх при смене маршрута
    // Используем как синхронный scrollTo, так и асинхронный для надежности
    window.scrollTo(0, 0);

    // Дополнительная прокрутка после небольшой задержки для медленных устройств
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Еще одна попытка через 100ms для случаев с lazy loading
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

  }, [pathname, state]);

  return null;
}

export default ScrollToTop;
