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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Проверяем поддержку Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Если браузер не поддерживает, загружаем видео сразу
      video.load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Видео стало видимым - загружаем и воспроизводим
            if (video.readyState === 0) {
              video.load();
            }

            // Пытаемся запустить воспроизведение
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                // Автовоспроизведение может быть заблокировано браузером
                console.debug('Video autoplay prevented:', error);
              });
            }
          } else {
            // Видео вышло из области видимости - приостанавливаем
            if (!video.paused) {
              video.pause();
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
