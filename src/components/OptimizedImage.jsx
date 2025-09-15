// src/components/OptimizedImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import MediaLoader from './MediaLoader';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  formats = ['webp', 'avif'] // Modern formats to try
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (priority) return; 

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback to placeholder on error
    setIsLoaded(true);
  };

  // Generate optimized source URLs
  const getOptimizedSrc = (originalSrc, format) => {
    if (format === 'original') return originalSrc;
    const ext = originalSrc.split('.').pop();
    return originalSrc.replace(`.${ext}`, `.${format}`);
  };

  // Check if browser supports format
  const supportsFormat = (format) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        minHeight: height ? `${height}px` : 'auto'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <MediaLoader size="default" variant="dots" />
        </div>
      )}
      
      {/* Actual image with modern format support */}
      {isInView && (
        <picture>
          {formats.map(format => 
            supportsFormat(format) && (
              <source 
                key={format}
                srcSet={getOptimizedSrc(src, format)} 
                type={`image/${format}`} 
              />
            )
          )}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`img-optimized transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              contentVisibility: 'auto',
              containIntrinsicSize: width && height ? `${width}px ${height}px` : '300px 200px'
            }}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
