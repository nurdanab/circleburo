// src/components/LazySection.jsx
import React, { useEffect, useRef, useState } from 'react';

const LazySection = ({ 
  children, 
  rootMargin = '50px', 
  threshold = 0.1,
  className = '',
  fallback = null 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div 
      ref={ref} 
      className={`lazy-section ${isVisible ? 'loaded' : ''} ${className}`}
      style={{
        minHeight: isVisible ? 'auto' : '200px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      {isVisible ? children : (fallback || <div style={{ height: '200px' }} />)}
    </div>
  );
};

export default LazySection;