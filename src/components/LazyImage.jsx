// src/components/LazyImage.jsx

import React, { useState, useRef, useEffect } from 'react';
import MediaLoader from './MediaLoader';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  blurDataURL = null,
  priority = false,
  onLoad = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Placeholder пока изображение загружается */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          {blurDataURL && (
            <img 
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            {placeholder || <MediaLoader size="default" variant="circle" />}
          </div>
        </div>
      )}

      {/* Основное изображение */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`img-optimized w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: '300px 200px'
          }}
        />
      )}

      {/* Fallback для ошибок загрузки */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Изображение недоступно</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
