// src/components/LazySection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/performance';
import MediaLoader from './MediaLoader';

const LazySection = ({ 
  children, 
  rootMargin = '100px', 
  threshold = 0.1,
  className = '',
  fallback = null,
  priority = false,
  animate = true
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(priority);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();
  const observerRef = useRef(null);

  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    if (priority) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsLoading(true);
          // Small delay to prevent layout shift
          setTimeout(() => {
            setIsVisible(true);
            setHasLoaded(true);
            setIsLoading(false);
          }, 50);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => observerRef.current?.disconnect();
  }, [rootMargin, threshold, hasLoaded, priority]);

  const getTransitionStyle = () => {
    if (!animate || reduceMotion) {
      return { opacity: isVisible ? 1 : 0 };
    }
    
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  const defaultFallback = (
    <div className="w-full h-48 flex items-center justify-center bg-gray-50">
      <MediaLoader size="default" variant="dots" />
    </div>
  );

  return (
    <div 
      ref={ref} 
      className={`lazy-section ${isVisible ? 'loaded' : ''} ${className}`}
      style={{
        minHeight: !isVisible && !priority ? '200px' : 'auto',
        ...getTransitionStyle()
      }}
    >
      {isLoading && !isVisible ? 
        (fallback || defaultFallback) : 
        isVisible ? children : 
        (fallback || <div className="h-48 bg-gray-50" />)
      }
    </div>
  );
};

export default LazySection;