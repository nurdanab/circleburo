// Hook для ленивой загрузки видео с помощью Intersection Observer
import { useEffect, useRef } from 'react';

/**
 * Hook для ленивой загрузки видео
 * Видео загружается и начинает играть только когда становится видимым
 *
 * @param {Object} options - Опции для Intersection Observer
 * @param {number} options.threshold - Процент видимости элемента (0-1)
 * @param {string} options.rootMargin - Отступ от viewport
 * @returns {Object} - Объект с ref для видео элемента
 */
export const useVideoLazyLoad = ({ threshold = 0.25, rootMargin = '50px' } = {}) => {
  const videoRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Проверяем поддержку Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Если браузер не поддерживает, загружаем видео сразу
      video.load();
      hasLoadedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Видео стало видимым - загружаем только один раз
            if (!hasLoadedRef.current && video.readyState === 0) {
              video.load();
              hasLoadedRef.current = true;
            }

            // Пытаемся запустить воспроизведение с задержкой для экономии ресурсов
            requestAnimationFrame(() => {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  // Автовоспроизведение может быть заблокировано браузером
                  console.debug('Video autoplay prevented:', error);
                });
              }
            });
          } else {
            // Видео вышло из области видимости - приостанавливаем
            if (!video.paused) {
              video.pause();

              // Агрессивная оптимизация памяти: очищаем буфер для больших видео
              // Только если видео больше 5MB (определяем по duration как прокси)
              if (video.duration > 30) {
                // Для длинных видео очищаем данные когда они не видны
                video.currentTime = 0;
              }
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { videoRef };
};
