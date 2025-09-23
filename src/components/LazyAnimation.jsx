// src/components/LazyAnimation.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';

// Ленивая загрузка Framer Motion только когда нужна анимация
const MotionDiv = lazy(() =>
  import('framer-motion').then(module => ({
    default: module.motion.div
  }))
);

const LazyAnimation = ({
  children,
  variants = {},
  initial = "hidden",
  animate = "visible",
  whileInView = false,
  viewport = { once: true, margin: "0px 0px -100px 0px" },
  className = "",
  enableAnimation = true,
  fallback = null,
  ...props
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Проверяем предпочтения пользователя
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Проверяем производительность устройства
    const isLowPerformance = navigator.hardwareConcurrency < 4 ||
                           navigator.deviceMemory < 4 ||
                           window.innerWidth < 768;

    // Включаем анимации только если пользователь их хочет и устройство справится
    if (enableAnimation && !prefersReducedMotion && !isLowPerformance) {
      setShouldAnimate(true);
    }
  }, [enableAnimation]);

  useEffect(() => {
    if (!shouldAnimate || !whileInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (viewport.once) {
            observer.disconnect();
          }
        } else if (!viewport.once) {
          setIsInView(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: viewport.margin || "0px"
      }
    );

    const element = document.querySelector(`[data-lazy-animation="true"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [shouldAnimate, whileInView, viewport]);

  // Статичный рендер для быстрого LCP
  const StaticContent = () => (
    <div
      className={className}
      data-lazy-animation="true"
      style={{
        opacity: shouldAnimate ? 0 : 1,
        transform: shouldAnimate ? 'translateY(20px)' : 'none',
        transition: shouldAnimate ? 'none' : 'opacity 0.3s ease, transform 0.3s ease'
      }}
      {...props}
    >
      {children}
    </div>
  );

  // Если анимации отключены, рендерим статично
  if (!shouldAnimate) {
    return <StaticContent />;
  }

  // Если анимации включены, загружаем Framer Motion лениво
  return (
    <Suspense fallback={fallback || <StaticContent />}>
      <MotionDiv
        className={className}
        variants={variants}
        initial={initial}
        animate={whileInView ? (isInView ? animate : initial) : animate}
        whileInView={whileInView ? animate : undefined}
        viewport={whileInView ? viewport : undefined}
        data-lazy-animation="true"
        {...props}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
};

export default LazyAnimation;