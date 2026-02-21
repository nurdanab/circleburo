/**
 * Media utility for CDN URLs
 * В development используются локальные файлы из /public
 * В production используется MinIO CDN (media.circleburo.kz)
 */

const MEDIA_CDN_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "";

/**
 * Получает URL медиа файла
 * @param path - путь к файлу (например: /home/hero.mp4)
 * @returns полный URL для development или CDN URL для production
 */
export function getMediaUrl(path: string): string {
  // В development возвращаем локальный путь
  if (!MEDIA_CDN_URL || process.env.NODE_ENV === "development") {
    return path;
  }

  // В production используем CDN
  // Убираем начальный слеш если есть
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${MEDIA_CDN_URL}/${cleanPath}`;
}

/**
 * Получает URL изображения с возможностью указать размер
 * @param path - путь к файлу
 * @param width - опциональная ширина для оптимизации
 */
export function getImageUrl(path: string, width?: number): string {
  const baseUrl = getMediaUrl(path);

  // Если указана ширина и это CDN, можно добавить параметры оптимизации
  // (зависит от настроек MinIO/Cloudflare)
  if (width && MEDIA_CDN_URL) {
    return `${baseUrl}?w=${width}`;
  }

  return baseUrl;
}

/**
 * Получает URL видео
 */
export function getVideoUrl(path: string): string {
  return getMediaUrl(path);
}

/**
 * Проверяет, является ли файл видео
 */
export function isVideo(path: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(path);
}

/**
 * Проверяет, является ли файл изображением
 */
export function isImage(path: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(path);
}
