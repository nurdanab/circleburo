// Advanced image optimization utility
export class ImageOptimizer {
  constructor() {
    this.supportedFormats = this.detectSupportedFormats();
    this.devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.connectionSpeed = this.getConnectionSpeed();
    this.isLowDataMode = this.getDataSaverMode();
  }

  // Detect supported image formats
  detectSupportedFormats() {
    if (typeof window === 'undefined') return ['webp', 'jpg'];

    const formats = [];
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Check AVIF support
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      formats.push('avif');
    }

    // Check WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      formats.push('webp');
    }

    // Fallback formats
    formats.push('jpg', 'png');

    return formats;
  }

  // Get connection speed
  getConnectionSpeed() {
    if (typeof window === 'undefined' || !navigator.connection) {
      return '4g';
    }
    return navigator.connection.effectiveType || '4g';
  }

  // Check if user has data saver mode enabled
  getDataSaverMode() {
    if (typeof window === 'undefined' || !navigator.connection) {
      return false;
    }
    return navigator.connection.saveData || false;
  }

  // Generate optimized image URL
  generateOptimizedUrl(src, options = {}) {
    const {
      width,
      height,
      quality = this.getOptimalQuality(),
      format = this.getBestFormat(),
      lazy = true
    } = options;

    // If it's already an optimized format, return as-is
    if (src.includes('.webp') || src.includes('.avif')) {
      return src;
    }

    // Extract base path and extension
    const lastDotIndex = src.lastIndexOf('.');
    const basePath = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex + 1);

    // Generate optimized filename
    let optimizedSrc = basePath;

    // Add dimensions if specified
    if (width || height) {
      optimizedSrc += `_${width || 'auto'}x${height || 'auto'}`;
    }

    // Add quality if not default
    if (quality !== 85) {
      optimizedSrc += `_q${quality}`;
    }

    // Add format extension
    optimizedSrc += `.${format}`;

    return optimizedSrc;
  }

  // Get optimal quality based on connection and preferences
  getOptimalQuality() {
    if (this.isLowDataMode) return 60;

    switch (this.connectionSpeed) {
      case 'slow-2g':
      case '2g':
        return 50;
      case '3g':
        return 70;
      case '4g':
      default:
        return 85;
    }
  }

  // Get best supported format
  getBestFormat() {
    if (this.isLowDataMode && this.supportedFormats.includes('webp')) {
      return 'webp';
    }

    // Prefer AVIF for best compression
    if (this.supportedFormats.includes('avif')) {
      return 'avif';
    }

    // Fallback to WebP
    if (this.supportedFormats.includes('webp')) {
      return 'webp';
    }

    return 'jpg';
  }

  // Generate responsive image srcset
  generateSrcSet(src, sizes = [400, 800, 1200, 1600]) {
    const format = this.getBestFormat();
    const quality = this.getOptimalQuality();

    return sizes.map(size => {
      const optimizedUrl = this.generateOptimizedUrl(src, {
        width: size,
        format,
        quality
      });
      return `${optimizedUrl} ${size}w`;
    }).join(', ');
  }

  // Generate responsive sizes attribute
  generateSizes(breakpoints = {
    mobile: 400,
    tablet: 800,
    desktop: 1200
  }) {
    const { mobile, tablet, desktop } = breakpoints;

    return [
      `(max-width: 640px) ${mobile}px`,
      `(max-width: 1024px) ${tablet}px`,
      `${desktop}px`
    ].join(', ');
  }

  // Preload critical images
  preloadImage(src, options = {}) {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';

    const optimizedSrc = this.generateOptimizedUrl(src, options);
    link.href = optimizedSrc;

    // Add responsive attributes if provided
    if (options.srcset) {
      link.setAttribute('imagesrcset', options.srcset);
    }

    if (options.sizes) {
      link.setAttribute('imagesizes', options.sizes);
    }

    // Set fetch priority
    if (options.fetchPriority) {
      link.setAttribute('fetchpriority', options.fetchPriority);
    }

    document.head.appendChild(link);
  }

  // Lazy load images with intersection observer
  lazyLoadImages(selector = '[data-lazy]') {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.lazy;

          if (src) {
            // Generate optimized URL
            const optimizedSrc = this.generateOptimizedUrl(src, {
              width: img.getAttribute('width'),
              height: img.getAttribute('height')
            });

            img.src = optimizedSrc;
            img.classList.add('fade-in');
            img.removeAttribute('data-lazy');
          }

          observer.unobserve(img);
        }
      });
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    });

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Convert existing images to optimized versions
  convertToWebP(src) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to convert to WebP'));
          }
        }, 'image/webp', this.getOptimalQuality() / 100);
      };

      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }

  // Analyze image performance
  analyzeImagePerformance() {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img');
    const analysis = {
      total: images.length,
      optimized: 0,
      unoptimized: 0,
      totalSize: 0,
      recommendations: []
    };

    images.forEach((img, index) => {
      const src = img.src || img.currentSrc;

      if (src.includes('.webp') || src.includes('.avif')) {
        analysis.optimized++;
      } else if (src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg')) {
        analysis.unoptimized++;
        analysis.recommendations.push({
          element: img,
          issue: 'Unoptimized format',
          suggestion: 'Convert to WebP or AVIF',
          priority: 'high'
        });
      }

      // Check for missing alt text
      if (!img.alt) {
        analysis.recommendations.push({
          element: img,
          issue: 'Missing alt attribute',
          suggestion: 'Add descriptive alt text',
          priority: 'high'
        });
      }

      // Check for missing dimensions
      if (!img.width || !img.height) {
        analysis.recommendations.push({
          element: img,
          issue: 'Missing dimensions',
          suggestion: 'Add width and height attributes',
          priority: 'medium'
        });
      }
    });

    return analysis;
  }
}

// Create singleton instance
export const imageOptimizer = new ImageOptimizer();

// Helper function for React components
export function useOptimizedImage(src, options = {}) {
  if (typeof window === 'undefined') return { src, srcSet: '', sizes: '' };

  const optimizer = new ImageOptimizer();

  return {
    src: optimizer.generateOptimizedUrl(src, options),
    srcSet: optimizer.generateSrcSet(src),
    sizes: optimizer.generateSizes(options.breakpoints),
    loading: options.priority ? 'eager' : 'lazy',
    decoding: 'async'
  };
}