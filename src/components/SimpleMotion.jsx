// src/components/SimpleMotion.jsx
// Легкая альтернатива Framer Motion для простых анимаций
import React, { useEffect, useRef, useState } from 'react';

// Intersection Observer Hook
const useInView = (options = {}) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.once) {
            observer.disconnect();
          }
        } else if (!options.once) {
          setInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, inView];
};

const SimpleMotion = {
  // Fade in animation
  FadeIn: ({ children, className = '', delay = 0, once = true, ...props }) => {
    const [ref, inView] = useInView({ once });

    return (
      <div
        ref={ref}
        className={`transition-all duration-700 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${className}`}
        style={{
          transitionDelay: `${delay}ms`,
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  },

  // Slide up animation
  SlideUp: ({ children, className = '', delay = 0, once = true, ...props }) => {
    const [ref, inView] = useInView({ once });

    return (
      <div
        ref={ref}
        className={`transition-all duration-800 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
        style={{
          transitionDelay: `${delay}ms`,
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  },

  // Scale in animation
  ScaleIn: ({ children, className = '', delay = 0, once = true, ...props }) => {
    const [ref, inView] = useInView({ once });

    return (
      <div
        ref={ref}
        className={`transition-all duration-600 ease-out ${
          inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${className}`}
        style={{
          transitionDelay: `${delay}ms`,
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  },

  // Stagger container
  StaggerContainer: ({ children, className = '', staggerDelay = 100, ...props }) => {
    const [ref, inView] = useInView({ once: true });

    return (
      <div ref={ref} className={className} {...props}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            style: {
              transitionDelay: inView ? `${index * staggerDelay}ms` : '0ms',
              ...child.props.style
            }
          })
        )}
      </div>
    );
  },

  // Simple hover effect wrapper
  Hover: ({ children, className = '', hoverScale = 1.05, ...props }) => {
    return (
      <div
        className={`transition-transform duration-300 ease-out hover:scale-[${hoverScale}] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
};

export { SimpleMotion };
export default SimpleMotion;