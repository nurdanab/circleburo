// src/utils/videoUtils.js

/**
 * Безопасное воспроизведение видео с обработкой race conditions
 * @param {HTMLVideoElement} video - Видео элемент
 * @returns {Promise<void>}
 */
export const safePlayVideo = (video) => {
  if (!video) return Promise.resolve();

  // Если уже воспроизводится, ничего не делаем
  if (!video.paused && !video.ended) {
    return Promise.resolve();
  }

  // Сбрасываем на начало если нужно
  if (video.ended) {
    video.currentTime = 0;
  }

  // Запускаем с обработкой ошибок
  const playPromise = video.play();

  if (playPromise !== undefined) {
    return playPromise.catch((error) => {
      // Игнорируем AbortError - это нормально при быстрой смене состояний
      if (error.name !== 'AbortError') {
        if (import.meta.env.DEV) {
          console.warn('Video play error:', error);
        }
      }
    });
  }

  return Promise.resolve();
};

/**
 * Безопасная остановка видео
 * @param {HTMLVideoElement} video - Видео элемент
 * @param {boolean} resetTime - Сбросить время на 0
 */
export const safePauseVideo = (video, resetTime = true) => {
  if (!video) return;

  // Проверяем что видео воспроизводится
  if (!video.paused && !video.ended) {
    video.pause();
  }

  // Сбрасываем время если нужно
  if (resetTime && video.currentTime > 0) {
    video.currentTime = 0;
  }
};

/**
 * Создает debounced версию функции управления видео
 * @param {Function} fn - Функция для debounce
 * @param {number} delay - Задержка в мс
 * @returns {Function}
 */
export const debounceVideo = (fn, delay = 100) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * Hook для безопасного управления видео при hover
 * @param {HTMLVideoElement} video - Видео элемент
 * @returns {Object} - Обработчики onMouseEnter и onMouseLeave
 */
export const createVideoHoverHandlers = (video) => {
  let playTimeout;
  let pauseTimeout;

  const handleMouseEnter = () => {
    // Отменяем отложенную паузу если есть
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
      pauseTimeout = null;
    }

    // Запускаем воспроизведение с небольшой задержкой
    playTimeout = setTimeout(() => {
      safePlayVideo(video);
    }, 50); // Небольшая задержка чтобы избежать случайных триггеров
  };

  const handleMouseLeave = () => {
    // Отменяем отложенное воспроизведение если есть
    if (playTimeout) {
      clearTimeout(playTimeout);
      playTimeout = null;
    }

    // Останавливаем с задержкой
    pauseTimeout = setTimeout(() => {
      safePauseVideo(video, true);
    }, 50);
  };

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };
};
