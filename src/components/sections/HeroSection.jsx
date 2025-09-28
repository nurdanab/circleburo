// src/components/sections/HeroSection.jsx
import "tailwindcss";
import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CriticalLoader from '../CriticalLoader';

// Lazy load VideoHero для улучшения LCP с preload
const VideoHero = lazy(() => import('../VideoHero'));

const HeroSection = () => {
  const { t } = useTranslation();
  // Проверяем предпочтения пользователя по анимациям
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Отключаем скролл анимации для производительности если пользователь предпочитает меньше анимаций
  const shouldAnimate = !prefersReducedMotion && !isMobile;
  
  // Трансформации для скролла (оптимизированы для производительности)
  const titleOpacity = useTransform(scrollY, [0, 300], shouldAnimate ? [1, 0] : [1, 1]);
  const titleScale = useTransform(scrollY, [0, 300], shouldAnimate ? [1, 0.8] : [1, 1]);
  const titleY = useTransform(scrollY, [0, 300], shouldAnimate ? [0, -100] : [0, 0]);
  // На мобильных отключаем сложные скролл-анимации для звезд
  const starsOpacity = useTransform(scrollY, [0, 200], shouldAnimate ? [1, 0] : [1, 1]);
  const starsScale = useTransform(scrollY, [0, 200], shouldAnimate ? [1, 1.2] : [1, 1]);

  useEffect(() => {
    setMounted(true);
    // Определяем мобильное устройство для оптимизации
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, 
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.8,
      },
    },
  };

  // Мемоизируем массив звездочек для фона (сокращено для Performance)
  const stars = useMemo(() => Array.from({ length: isMobile ? 5 : 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // размер от 1 до 4px
    x: Math.random() * 100, // позиция по X в процентах
    y: Math.random() * 100, // позиция по Y в процентах
    delay: Math.random() * 3, // уменьшена задержка анимации
    duration: Math.random() * 2 + 3, // длительность мерцания
    opacity: Math.random() * 0.6 + 0.3, // прозрачность от 0.3 до 0.9
    twinkleDelay: Math.random() * 2, // уменьшена задержка мерцания
  })), [isMobile]);

  // Мемоизируем массив больших светящихся кружочков (уменьшено для Performance)
  const glowDots = useMemo(() => {
    if (isMobile) return []; // На мобильных отключаем для производительности
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 60, // размер от 60 до 140px
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 6 + 8, // немного ускорена пульсация
      opacity: Math.random() * 0.08 + 0.03, // очень слабая прозрачность
    }));
  }, [isMobile]);

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

  const glowVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
    },
    visible: (custom) => ({
      scale: 1,
      opacity: custom.opacity,
      transition: {
        delay: custom.delay,
        duration: 1.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-white bg-black overflow-hidden">
      
      {/* Анимированные звездочки и кружочки на фоне */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          opacity: mounted ? starsOpacity : 1,
          scale: mounted ? starsScale : 1,
        }}
      >
        {/* Звездочки */}
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            variants={starVariants}
            custom={star}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white rounded-full"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
                willChange: 'opacity, transform',
              }}
              animate={{
                opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: star.twinkleDelay,
              }}
            />
          </motion.div>
        ))}

        {/* Большие светящиеся кружочки */}
        {glowDots.map((dot) => (
          <motion.div
            key={`glow-${dot.id}`}
            className="absolute rounded-full"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 70%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            variants={glowVariants}
            custom={dot}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.1, 
              borderColor: 'rgba(255, 255, 255, 0.15)',
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
                willChange: 'opacity, transform',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [dot.opacity, dot.opacity * 1.5, dot.opacity],
              }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </motion.div>

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
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div className="transform translate-y-0 sm:-translate-y-12 lg:-translate-y-14 xl:-translate-y-14 2xl:-translate-y-18">
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
        className="relative z-20 text-center px-4 w-full h-full flex flex-col justify-center items-center translate-y-8 sm:translate-y-12 md:translate-y-16"
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
            opacity: mounted ? titleOpacity : 1,
            scale: mounted ? titleScale : 1,
            y: mounted ? titleY : 0,
            willChange: 'opacity, transform',
            transform: 'translateZ(0)', // Активируем аппаратное ускорение
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
        <motion.div
          className="text-white/60 text-sm font-light mb-2 tracking-wide"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          SCROLL DOWN
        </motion.div>
        
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
          style={{ willChange: 'border-color' }}
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: 'transform, opacity' }}
          />
        </motion.div>
        
        <motion.div
          className="mt-2 text-white/40"
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;