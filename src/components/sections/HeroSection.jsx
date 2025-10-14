// src/components/sections/HeroSection.jsx
import "tailwindcss";
import React, { useEffect, useState, useMemo, Suspense, lazy, memo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CriticalLoader from '../CriticalLoader';

// Lazy load VideoHero для улучшения LCP с preload
const VideoHero = lazy(() => import('../VideoHero'));

const HeroSection = memo(() => {
  const { t } = useTranslation();
  // Проверяем предпочтения пользователя по анимациям
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // КРИТИЧНО: Отключаем scroll-анимации на мобильных для производительности
  // Scroll-анимации вызывают janky scrolling на мобильных и слабых устройствах
  const shouldAnimate = !prefersReducedMotion && !isMobile;

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.01 : 0.05, // Максимально быстро
        duration: isMobile ? 0.15 : 0.3, // Сокращено вдвое
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 5 : 20, // Минимальное движение на мобильных
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.15 : 0.3, // Еще быстрее
        ease: "easeOut", // Упрощенный easing для лучшей производительности
      },
    },
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: isMobile ? 0.3 : 0.6, // Быстрее на мобильных
        duration: isMobile ? 0.2 : 0.3,
      },
    },
  };

  // Мемоизируем массив звездочек для фона (МИНИМАЛЬНО для Performance)
  // ОТКЛЮЧЕНО для максимальной производительности
  const stars = useMemo(() => [], []);

  const starVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
    },
    visible: (custom) => ({
      scale: 1,
      opacity: custom.opacity,
      transition: {
        delay: custom.delay,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };


  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-white bg-black overflow-hidden">
      
      {/* Звезды отключены для производительности - stars.length === 0 */}

      {/* LCP Статичный контент для быстрого рендеринга */}
      <div className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center">
        <div className="w-full max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[50vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] flex items-center justify-center">
          {/* Статичный элемент для LCP */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900/20 to-gray-800/10 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)] rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* 3D анимация видео загружается после критического контента */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center" style={{ marginTop: '2rem' }}>
        <div className="transform translate-y-0">
          <Suspense fallback={
            <div className="w-full max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[50vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] flex items-center justify-center">
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTop: '2px solid rgba(255,255,255,0.6)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                transform: 'translateZ(0)'
              }}></div>
            </div>
          }>
            <VideoHero />
          </Suspense>
        </div>
      </div>

      {/* Главный контент */}
      <motion.div
        className="relative z-20 text-center px-4 w-full h-full flex flex-col justify-center items-center"
        style={{ marginTop: '2rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] xl:text-[12vw] 2xl:text-[10vw] font-black leading-none tracking-wider select-none"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.08)',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)',
            willChange: 'auto', // Убираем will-change для лучшей производительности
            transform: 'translateZ(0)',
            contain: 'layout style paint',
          }}
          variants={titleVariants}
        >
          CIRCLE
        </motion.h1>

        {/* Подзаголовок с ключевыми словами */}
        <motion.h2
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/80 mt-16 sm:mt-20 md:mt-24 lg:mt-32 text-center max-w-4xl px-4 leading-relaxed"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          {t('main.subtitle')}
        </motion.h2>
      </motion.div>

      {/* Индикатор скролла */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-white/60 text-sm font-light mb-2 tracking-wide">
          SCROLL DOWN
        </div>

        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden"
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        <div className="mt-2 text-white/40">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;