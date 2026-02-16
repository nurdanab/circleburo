const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || '';

/**
 * Get full URL for media file from MinIO storage
 * @param path - Path like "/home/hero.png" or "home/hero.png"
 * @returns Full URL like "https://media.circleburo.kz/home/hero.png"
 */
export function getMediaUrl(path: string): string {
  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If no MEDIA_URL configured, return original path (for local dev)
  if (!MEDIA_URL) {
    return `/${cleanPath}`;
  }

  return `${MEDIA_URL}/${cleanPath}`;
}

/**
 * Get srcSet for responsive images
 */
export function getMediaSrcSet(path: string, widths: number[] = [640, 1024, 1920]): string {
  const baseUrl = getMediaUrl(path);
  return widths.map(w => `${baseUrl}?w=${w} ${w}w`).join(', ');
}
