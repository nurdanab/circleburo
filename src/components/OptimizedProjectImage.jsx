// src/components/OptimizedProjectImage.jsx
import React, { memo } from 'react';

/**
 * Оптимизированный компонент изображения для ProjectsSection
 * Поддерживает современные форматы (WebP, AVIF) с fallback
 */
const OptimizedProjectImage = memo(({
  src,
  alt,
  loading = 'lazy',
  fetchPriority = 'low',
  className = ''
}) => {
  // Извлекаем имя файла без расширения
  const getImagePath = (format) => {
    if (!src) return '';
    const pathParts = src.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    return `${basePath}.${format}`;
  };

  return (
    <picture>
      {/* AVIF - самый современный и эффективный формат */}
      <source
        type="image/avif"
        srcSet={getImagePath('avif')}
      />

      {/* WebP - широко поддерживаемый современный формат */}
      <source
        type="image/webp"
        srcSet={getImagePath('webp')}
      />

      {/* Fallback на оригинальный формат */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
});

OptimizedProjectImage.displayName = 'OptimizedProjectImage';

export default OptimizedProjectImage;
