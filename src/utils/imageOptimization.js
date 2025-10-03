// src/utils/imageOptimization.js

/**
 * Mobile-first image optimization utilities
 */

import { getConnectionInfo, getOptimalImageQuality } from './networkDetection';

/**
 * Get responsive image sizes based on device and viewport
 * @param {Object} options - Image options
 * @returns {string} Sizes attribute for responsive images
 */
export const getResponsiveSizes = (options = {}) => {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    maxWidth = null
  } = options;

  if (maxWidth) {
    return `(max-width: 767px) ${mobile}, (max-width: 1023px) ${tablet}, ${desktop}`;
  }

  return `(max-width: 767px) ${mobile}, (max-width: 1023px) ${tablet}, ${desktop}`;
};

/**
 * Generate srcset for responsive images
 * @param {string} src - Base image source
 * @param {Array} widths - Array of widths to generate
 * @returns {string} Srcset attribute
 */
export const generateSrcSet = (src, widths = [640, 768, 1024, 1280, 1920]) => {
  const { slow, saveData } = getConnectionInfo();
  const isMobile = window.innerWidth < 768;

  // Reduce image variants on slow connections
  if (slow || saveData) {
    widths = isMobile ? [640] : [640, 1280];
  }

  const basePath = src.split('.').slice(0, -1).join('.');
  const ext = src.split('.').pop();

  return widths
    .map(width => `${basePath}-${width}w.${ext} ${width}w`)
    .join(', ');
};

/**
 * Get optimal image format based on browser support
 * @returns {Promise<string>} Preferred image format
 */
export const getOptimalImageFormat = () => {
  return new Promise((resolve) => {
    // Check AVIF support
    const avifImg = new Image();
    avifImg.onload = () => resolve('avif');
    avifImg.onerror = () => {
      // Check WebP support
      const webpImg = new Image();
      webpImg.onload = () => resolve('webp');
      webpImg.onerror = () => resolve('jpg');
      webpImg.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    };
    avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Determine if image should be lazy loaded
 * @param {number} index - Image index in list
 * @param {boolean} priority - Priority flag
 * @returns {boolean}
 */
export const shouldLazyLoad = (index = 0, priority = false) => {
  if (priority) return false;

  const isMobile = window.innerWidth < 768;
  const { slow, saveData } = getConnectionInfo();

  // On mobile or slow connection, lazy load more aggressively
  if (isMobile || slow || saveData) {
    return index > 0; // Lazy load all but first image
  }

  // On desktop with good connection, lazy load after first 3
  return index > 2;
};

/**
 * Get optimal image quality based on connection
 * @returns {number} JPEG quality (1-100)
 */
export const getImageQuality = () => {
  const quality = getOptimalImageQuality();
  const qualityMap = {
    low: 60,
    medium: 75,
    high: 85
  };
  return qualityMap[quality] || 75;
};

/**
 * Calculate intersection observer margin based on device
 * @param {boolean} priority - Priority flag
 * @returns {string} rootMargin value
 */
export const getIntersectionMargin = (priority = false) => {
  if (priority) return '0px';

  const isMobile = window.innerWidth < 768;
  const { slow, saveData } = getConnectionInfo();

  // Conservative margins on mobile/slow connections to save data
  if (isMobile && (slow || saveData)) {
    return '20px';
  }

  if (isMobile) {
    return '50px';
  }

  // Desktop can afford larger margins
  return slow || saveData ? '50px' : '100px';
};

/**
 * Preload critical images
 * @param {Array} images - Array of image sources
 * @param {number} limit - Max images to preload
 */
export const preloadCriticalImages = (images, limit = 2) => {
  const isMobile = window.innerWidth < 768;
  const { slow, saveData } = getConnectionInfo();

  // Don't preload on slow mobile connections
  if (isMobile && (slow || saveData)) {
    limit = 1;
  }

  images.slice(0, limit).forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = index === 0 ? 'high' : 'low';
    document.head.appendChild(link);
  });
};

/**
 * Get optimal decode strategy
 * @param {boolean} priority - Priority flag
 * @returns {string} Decoding strategy
 */
export const getDecodeStrategy = (priority = false) => {
  const isMobile = window.innerWidth < 768;

  // Sync decode for critical images on desktop
  if (priority && !isMobile) {
    return 'sync';
  }

  // Async for everything else
  return 'async';
};

/**
 * Calculate optimal blur placeholder size
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {Object} Placeholder dimensions
 */
export const getPlaceholderSize = (width, height) => {
  const maxPlaceholderSize = 40; // Max size for blur placeholder
  const aspectRatio = width / height;

  if (aspectRatio > 1) {
    // Landscape
    return {
      width: maxPlaceholderSize,
      height: Math.round(maxPlaceholderSize / aspectRatio)
    };
  } else {
    // Portrait or square
    return {
      width: Math.round(maxPlaceholderSize * aspectRatio),
      height: maxPlaceholderSize
    };
  }
};