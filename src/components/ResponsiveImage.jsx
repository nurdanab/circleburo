// src/components/ResponsiveImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import MediaLoader from './MediaLoader';

/**
 * Компонент для адаптивной загрузки изображений
 * Загружает изображения разного размера в зависимости от устройства
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = {
    mobile: null,   // путь к мобильной версии
    tablet: null,   // путь к версии для планшетов
    desktop: src    // десктопная версия по умолчанию
  },
  onLoad = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef(null);

  // Определяем оптимальное изображение для текущего устройства
  useEffect(() => {
    const getOptimalSrc = () => {
      const width = window.innerWidth;

      // Мобильные устройства (< 768px)
      if (width < 768 && sizes.mobile) {
        return sizes.mobile;
      }

      // Планшеты (768px - 1024px)
      if (width < 1024 && sizes.tablet) {
        return sizes.tablet;
      }

      // Десктоп
      return sizes.desktop || src;
    };

    setCurrentSrc(getOptimalSrc());

    // Слушаем изменение размера окна для адаптации
    const handleResize = () => {
      const newSrc = getOptimalSrc();
      if (newSrc !== currentSrc) {
        setCurrentSrc(newSrc);
        setIsLoaded(false); // Сбрасываем состояние для перезагрузки
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [src, sizes, currentSrc]);

  // Intersection Observer для ленивой загрузки
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
        threshold: 0.01,
        rootMargin: '100px' // Начинаем загрузку за 100px до появления
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
      {/* Placeholder во время загрузки */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
          <MediaLoader size="default" variant="circle" />
        </div>
      )}

      {/* Основное изображение */}
      {isInView && currentSrc && !hasError && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
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

      {/* Fallback при ошибке */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Изображение недоступно</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
