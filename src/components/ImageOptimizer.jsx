import React, { useState, useRef, useEffect, memo } from 'react';
import MediaLoader from './MediaLoader';

const ImageOptimizer = memo(({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  formats = ['avif', 'webp', 'jpg'],
  placeholder = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources with WebP and AVIF support
  const generateSources = (baseSrc) => {
    if (!baseSrc) return [];
    
    const baseName = baseSrc.split('.').slice(0, -1).join('.');
    const sources = [];
    
    // AVIF format (best compression)
    if (formats.includes('avif')) {
      const avifSrcSet = [
        `${baseName}-small.avif 480w`,
        `${baseName}-medium.avif 768w`,
        `${baseName}-large.avif 1200w`,
        `${baseName}-xlarge.avif 1920w`
      ].join(', ');
      
      sources.push({
        srcSet: avifSrcSet,
        type: 'image/avif',
        sizes
      });
    }
    
    // WebP format (good compression, wide support)
    if (formats.includes('webp')) {
      const webpSrcSet = [
        `${baseName}-small.webp 480w`,
        `${baseName}-medium.webp 768w`,
        `${baseName}-large.webp 1200w`,
        `${baseName}-xlarge.webp 1920w`
      ].join(', ');
      
      sources.push({
        srcSet: webpSrcSet,
        type: 'image/webp',
        sizes
      });
    }
    
    // Fallback formats
    ['jpg', 'jpeg', 'png'].forEach(format => {
      if (formats.includes(format)) {
        const srcSet = [
          `${baseName}-small.${format} 480w`,
          `${baseName}-medium.${format} 768w`,
          `${baseName}-large.${format} 1200w`,
          `${baseName}-xlarge.${format} 1920w`
        ].join(', ');
        
        sources.push({
          srcSet,
          type: `image/${format}`,
          sizes
        });
      }
    });
    
    return sources;
  };

  useEffect(() => {
    if (priority) {
      setCurrentSrc(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSrc(src);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const sources = generateSources(currentSrc);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
      {...props}
    >
      {/* Placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <MediaLoader size="small" variant="dots" />
        </div>
      )}
      
      {/* Actual image with sources */}
      {currentSrc && !hasError && (
        <picture>
          {sources.map((source, index) => (
            <source 
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              sizes={source.sizes}
            />
          ))}
          <img
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </picture>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
});

ImageOptimizer.displayName = 'ImageOptimizer';

export default ImageOptimizer;