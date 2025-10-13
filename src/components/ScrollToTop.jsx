// src/components/ScrollToTop.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для автоматической прокрутки страницы вверх при изменении маршрута
 * Это решает проблему, когда при переходе на новую страницу, она открывается не сверху
 * Улучшенная версия с поддержкой мобильных устройств
 */
function ScrollToTop() {
  const { pathname, state } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Если в state есть scrollTo, значит это навигация к секции - пропускаем scroll to top
    if (state?.scrollTo) {
      return;
    }

    // Проверяем, действительно ли изменился путь
    if (previousPathname.current === pathname) {
      return;
    }

    // Обновляем предыдущий путь
    previousPathname.current = pathname;

    // Агрессивная прокрутка вверх для мобильных устройств
    const scrollToTopAggressive = () => {
      // Метод 1: Нативный scrollTo
      window.scrollTo(0, 0);

      // Метод 2: Прокрутка через document
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Метод 3: Прокрутка через window с опциями
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    };

    // Немедленная прокрутка
    scrollToTopAggressive();

    // Прокрутка в следующем тике для обработки асинхронных обновлений
    requestAnimationFrame(() => {
      scrollToTopAggressive();
    });

    // Прокрутка после небольшой задержки для медленных устройств и lazy loading
    const timeout1 = setTimeout(() => {
      scrollToTopAggressive();
    }, 50);

    const timeout2 = setTimeout(() => {
      scrollToTopAggressive();
    }, 150);

    // Финальная проверка через 300ms для самых медленных устройств
    const timeout3 = setTimeout(() => {
      scrollToTopAggressive();
    }, 300);

    // Очистка таймеров
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname, state]);

  return null;
}

export default ScrollToTop;
