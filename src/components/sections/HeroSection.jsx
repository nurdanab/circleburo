// src/components/sections/HeroSection.jsx
import "tailwindcss";
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LazyBlenderModel from '../LazyBlenderModel';

const HeroSection = () => {
  // Scroll анимации
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Трансформации для скролла
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const titleY = useTransform(scrollY, [0, 300], [0, -100]);
  const starsOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const starsScale = useTransform(scrollY, [0, 200], [1, 1.2]);

  useEffect(() => {
    setMounted(true);
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

  // Генерируем массив звездочек для фона
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // размер от 1 до 4px
    x: Math.random() * 100, // позиция по X в процентах
    y: Math.random() * 100, // позиция по Y в процентах
    delay: Math.random() * 5, // задержка анимации
    duration: Math.random() * 3 + 2, // длительность мерцания
    opacity: Math.random() * 0.8 + 0.2, // прозрачность от 0.2 до 1
    twinkleDelay: Math.random() * 4, // задержка мерцания
  }));

  // Генерируем массив больших светящихся кружочков
  const glowDots = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 40, // размер от 40 до 140px
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 8 + 10, // медленная пульсация
    opacity: Math.random() * 0.1 + 0.05, // очень слабая прозрачность
  }));

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

      {/* 3D модель остается на месте */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-100 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center"> {/* Полный размер контейнера, но центрируем модель */}
          <div className="flex items-center justify-center w-full h-full transform translate-y-8"> {/* Опускаем контейнер ниже */}
            <LazyBlenderModel />
          </div>
        </div>
      </div>

      {/* Главный контент */}
      <motion.div
        className="relative z-20 text-center px-4 w-full h-full flex flex-col justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[28vw] sm:text-[24vw] md:text-[20vw] lg:text-[18vw] xl:text-[16vw] 2xl:text-[14vw] font-black leading-none tracking-wider select-none"
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.1), 0 0 80px rgba(255, 255, 255, 0.05)',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
            opacity: mounted ? titleOpacity : 1,
            scale: mounted ? titleScale : 1,
            y: mounted ? titleY : 0,
          }}
          variants={titleVariants}
        >
          CIRCLE
        </motion.h1>
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