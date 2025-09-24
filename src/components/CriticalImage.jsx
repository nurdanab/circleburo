// src/components/CriticalImage.jsx
import React from 'react';

// Компонент для критических изображений (hero, logo и т.д.) для оптимизации LCP
const CriticalImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`critical-image ${className}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        contentVisibility: 'visible', // Критические изображения всегда видимы
        transform: 'translateZ(0)', // GPU acceleration
        backfaceVisibility: 'hidden',
        ...style
      }}
      loading="eager" // Критические изображения загружаются сразу
      decoding="sync" // Синхронная декодировка для быстрого отображения
      fetchPriority="high" // Высокий приоритет загрузки
      {...props}
    />
  );
};

export default CriticalImage;