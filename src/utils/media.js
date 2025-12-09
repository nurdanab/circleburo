// src/utils/media.js
// Утилита для получения правильных путей к медиа-файлам из MinIO

// MinIO base URL из переменных окружения
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || '';

/**
 * Получает полный URL для медиа-файла из MinIO или локально
 * @param {string} path - путь к файлу (например, 'videos/prod1.mp4' или '/img/logo.png')
 * @returns {string} - полный URL к медиа
 */
export const getMediaUrl = (path) => {
  // Убираем начальный слеш если есть
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Если есть MinIO URL, используем его
  if (MEDIA_BASE_URL) {
    // Добавляем /media/ для bucket в MinIO
    // Добавляем версию для обхода кэша CloudFlare (временно)
    const url = `${MEDIA_BASE_URL}/media/${cleanPath}`;

    // Для видео добавляем версию для обхода кэша
    if (cleanPath.endsWith('.mp4')) {
      return `${url}?v=20251209`;
    }

    return url;
  }

  // Иначе возвращаем локальный путь
  return `/${cleanPath}`;
};

/**
 * Получает полный URL для видео-файла
 * @param {string} filename - имя видео-файла
 * @returns {string} - полный путь к видео
 */
export const getVideoUrl = (filename) => {
  return getMediaUrl(`videos/${filename}`);
};

/**
 * Получает полный URL для изображения
 * @param {string} filename - имя файла изображения (относительно /img/)
 * @returns {string} - полный путь к изображению
 */
export const getImageUrl = (filename) => {
  return getMediaUrl(`img/${filename}`);
};

/**
 * Получает полный URL для cover файла
 * @param {string} filename - имя файла cover
 * @returns {string} - полный путь к cover
 */
export const getCoverUrl = (filename) => {
  return getMediaUrl(`cover/${filename}`);
};
