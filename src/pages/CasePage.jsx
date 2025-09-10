import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import LazyImage from '../components/LazyImage';
import useSEO from '../hooks/useSEO';
import '../styles/CasePage.css';


// Первая секция: Hero - полностью адаптивная с улучшенной производительностью
const HeroSection = React.memo(() => {
  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), []);

  const subtitleVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  }), []);

  return (
    <section className="relative h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden flex flex-col justify-center items-center">
      {/* Заголовок в центре с улучшенной адаптивностью */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black text-yellow-200 leading-[0.9] tracking-tight"
            style={{
              textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 4px 4px 8px rgba(0, 0, 0, 0.3)',
              fontFamily: 'Montserrat, sans-serif'
            }}>
            STEPPE<br />COFFEE
          </h1>
        </motion.div>
      </div>

      {/* Подзаголовок в левом нижнем углу - улучшенная адаптивность */}
      <motion.div
        className="absolute bottom-3 left-3 xs:bottom-4 xs:left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12 xl:bottom-16 xl:left-16 z-10 max-w-[180px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-md"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 xs:p-3 sm:p-4 border border-white/10">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-light font-montserrat">
            <span className="text-yellow-200 font-medium">Полный цикл</span> создания бренда:<br />
            от стратегии до реализации
          </p>
        </div>
      </motion.div>

      {/* Печать в правом нижнем углу - увеличенная */}
      <motion.div
        className="absolute bottom-4 right-4 xs:bottom-6 xs:right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16 xl:bottom-20 xl:right-20 z-10"
        initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        whileHover={{ scale: 1.15, rotate: 5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200/30 rounded-full blur-xl scale-110"></div>
          <LazyImage 
            src="/img/projects/stamp.webp" 
            alt="Stamp" 
            className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain filter drop-shadow-2xl"
            priority={false}
          />
        </div>
      </motion.div>

      {/* Индикатор прокрутки - улучшенный */}
      <motion.div
        className="absolute bottom-8 xs:bottom-10 sm:bottom-12 md:bottom-16 lg:bottom-20 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
          <span className="text-sm text-white/60 font-light tracking-wider uppercase font-montserrat">
            Прокрутите вниз
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3"
          >
            <ChevronDown className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-200" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

// ContentSection - оптимизированная и адаптивная
const ContentSection = React.memo(() => {
  const sectionVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), []);

  const rightSectionVariants = useMemo(() => ({
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), []);

  return (
    <section className="min-h-screen relative flex flex-col lg:flex-row bg-gradient-to-r from-white via-gray-50 to-yellow-50">
      {/* Левая белая часть - улучшенная */}
      <div className="w-full lg:w-1/2 bg-white relative z-30 min-h-[70vh] lg:min-h-full">
        <div className="h-full flex items-center justify-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          <motion.div 
            className="w-full max-w-sm xs:max-w-md sm:max-w-lg lg:max-w-xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Декоративный элемент */}
            <div className="absolute -top-2 -left-2 w-3 h-3 xs:w-4 xs:h-4 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-40 animate-pulse"></div>
            
            {/* Заголовок секции - улучшенный */}
            <div className="mb-4 xs:mb-6 sm:mb-8 md:mb-10">
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-3 xs:mb-4 sm:mb-6 font-montserrat">
                    Позиционирование бренда
                  </h2>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-3 xs:p-4 sm:p-6 border-l-4 border-yellow-300 shadow-sm">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed font-normal font-montserrat">
                      Мы составили уникальное торговое предложение, где Steppe Coffee не просто кофейня, а 
                      <span className="font-semibold text-gray-900 bg-yellow-100 px-2 py-1 rounded-md mx-1 whitespace-nowrap">"четвертое пространство"</span>, 
                      где рождаются смыслы, собирается креатив, кофе и культура.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Целевая аудитория - улучшенная */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 font-montserrat">
                Целевая аудитория
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-normal font-montserrat">
                В ходе анализа целевой аудитории были выявлены основные сегменты потенциальных посетителей:
              </p>
              
              {/* Список аудитории с серым дизайном */}
              <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                <motion.div 
                  className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-3 xs:p-4 sm:p-5 border-l-4 border-gray-300 hover:shadow-md transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-3 xs:gap-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-normal leading-relaxed font-montserrat">
                      <span className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">Профессионалы</span><br />
                      <span className="text-gray-600">ценящие удобное пространство для работы и встреч</span>
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-3 xs:p-4 sm:p-5 border-l-4 border-gray-300 hover:shadow-md transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-3 xs:gap-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-normal leading-relaxed font-montserrat">
                      <span className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">Творческая молодежь</span><br />
                      <span className="text-gray-600">студенты, ищущие атмосферу для вдохновения</span>
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-3 xs:p-4 sm:p-5 border-l-4 border-gray-300 hover:shadow-md transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-3 xs:gap-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-normal leading-relaxed font-montserrat">
                      <span className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl">Городские жители</span><br />
                      <span className="text-gray-600">рассматривающие кофейню как место качественного отдыха</span>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Правая желтая часть - улучшенная */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-300 relative z-30 min-h-[70vh] lg:min-h-full">
        <div className="h-full flex items-start justify-center pt-4 xs:pt-6 sm:pt-8 md:pt-10 lg:pt-12 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          <motion.div
            className="w-full max-w-sm xs:max-w-md sm:max-w-lg lg:max-w-xl"
            variants={rightSectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Декоративный элемент */}
            <div className="absolute -top-1 -right-1 w-2 h-2 xs:w-3 xs:h-3 bg-yellow-500 rounded-full opacity-30"></div>
            
            {/* Заголовок секции */}
            <div className="mb-4 xs:mb-6 md:mb-8">
              <div className="flex items-start gap-2 xs:gap-3 mb-3 xs:mb-4">
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2 xs:mb-3 font-montserrat">
                    Конкурентный анализ
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed font-normal font-montserrat">
                    Провели сравнительный анализ прямых и косвенных конкурентов для определения уникальной позиции.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Блоки конкурентов */}
            <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-6 md:mb-8">
              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-2 xs:p-3 md:p-4 border-l-2 border-gray-700 transition-all duration-200">
                <h4 className="font-medium text-gray-900 mb-1 xs:mb-2 text-xs xs:text-sm md:text-base flex items-center gap-2 font-montserrat">
                  <span className="w-1 h-1 bg-gray-700 rounded-full flex-shrink-0"></span>
                  Прямые конкуренты
                </h4>
                <p className="text-xs xs:text-xs md:text-sm text-gray-700 leading-relaxed font-normal pl-2 xs:pl-3 font-montserrat">
                  локальные кофейни с авторским кофе и уютной атмосферой
                </p>
              </div>
              
              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-2 xs:p-3 md:p-4 border-l-2 border-gray-700 transition-all duration-200">
                <h4 className="font-medium text-gray-900 mb-1 xs:mb-2 text-xs xs:text-sm md:text-base flex items-center gap-2 font-montserrat">
                  <span className="w-1 h-1 bg-gray-700 rounded-full flex-shrink-0"></span>
                  Косвенные конкуренты
                </h4>
                <p className="text-xs xs:text-xs md:text-sm text-gray-700 leading-relaxed font-normal pl-2 xs:pl-3 font-montserrat">
                  сетевые кофейни, рестораны с кофейным меню, коворкинги
                </p>
              </div>
            </div>

            {/* Tone of Voice секция */}
            <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 xs:mb-3 md:mb-4 font-montserrat">
              Tone of Voice
            </h3>
            <p className="text-xs xs:text-xs sm:text-xs md:text-sm text-gray-800 leading-relaxed font-normal mb-3 xs:mb-4 font-montserrat">
              Для бренда Steppe Coffee разработан tone of voice, отражающий ценности и характер заведения:
            </p>
            
            <div className="space-y-2 xs:space-y-3">
              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-2 xs:p-3 transition-all duration-200">
                <h5 className="font-medium text-gray-900 mb-1 text-xs xs:text-xs md:text-sm font-montserrat">
                  Дружелюбный и вдохновляющий
                </h5>
                <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                  создает ощущение открытости и поддержки
                </p>
              </div>
              
              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-2 xs:p-3 transition-all duration-200">
                <h5 className="font-medium text-gray-900 mb-1 text-xs xs:text-xs md:text-sm font-montserrat">
                  Современный, но с локальными акцентами
                </h5>
                <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                  сохраняет близость к культуре и идентичности города
                </p>
              </div>
              
              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-2 xs:p-3 transition-all duration-200">
                <h5 className="font-medium text-gray-900 mb-1 text-xs xs:text-xs md:text-sm font-montserrat">
                  Неформальный, живой стиль
                </h5>
                <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                  помогает общаться с аудиторией на одном языке
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// Маркетинговая секция
const MarketingSection = () => {
  return (
    <section className="bg-white relative flex flex-col md:flex-row min-h-screen">
      {/* Заголовок по центру с улучшенной адаптивностью */}
      <div className="absolute top-2 xs:top-3 sm:top-4 md:top-6 lg:top-8 xl:top-12 left-1/2 transform -translate-x-1/2 z-50">
        <motion.h2 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-gray-900 mb-2 xs:mb-4 sm:mb-6 leading-none text-center px-2 xs:px-3 sm:px-5"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          МАРКЕТИНГ
        </motion.h2>
      </div>
      
      {/* Левая часть - Социальные сети */}
      <div className="w-full md:w-1/2 relative z-40 min-h-[50vh] md:min-h-full" style={{ backgroundColor: '#E8C5A0' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/95 to-orange-300/95 backdrop-blur-sm"></div>
        
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-between h-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-8 xs:pt-10 sm:pt-12 md:pt-16 lg:pt-20"
          >
            <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 xs:mb-4 md:mb-6">
                Социальные сети
              </h3>
              
              <div className="space-y-2 xs:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/20">
                  <p className="font-medium text-gray-900 mb-1 xs:mb-2 md:mb-3">
                    Разработали контент-план для:
                  </p>
                  <div className="grid grid-cols-2 gap-1 xs:gap-2 text-gray-800">
                    <span className="bg-white/40 px-1 xs:px-2 py-1 rounded-lg text-center text-sm font-medium">Instagram</span>
                    <span className="bg-white/40 px-1 xs:px-2 py-1 rounded-lg text-center text-sm font-medium">TikTok</span>
                    <span className="bg-white/40 px-1 xs:px-2 py-1 rounded-lg text-center text-sm font-medium">LinkedIn</span>
                    <span className="bg-white/40 px-1 xs:px-2 py-1 rounded-lg text-center text-sm font-medium">Threads</span>
                  </div>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/20">
                  <p className="text-gray-900 text-sm sm:text-base md:text-lg">
                    Настроили профили и проводим съемки для социальных сетей
                  </p>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/20">
                  <p className="text-gray-900 text-sm sm:text-base md:text-lg">
                    Еженедельно отслеживаем статистику и улучшаем форматы
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex justify-center mt-3 xs:mt-4 md:mt-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <LazyImage 
              src="/img/projects/activity.webp" 
              alt="Активности Steppe Coffee" 
              className="w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80 xl:w-96 h-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Правая часть - Offline активности */}
      <div className="w-full md:w-1/2 bg-gray-100 relative z-40 min-h-[50vh] md:min-h-full">
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-between h-full">
          <motion.div
            className="flex justify-center pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-16 mb-3 xs:mb-4 md:mb-6"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <LazyImage 
              src="/img/projects/social.webp" 
              alt="Социальные сети Steppe Coffee" 
              className="w-44 xs:w-52 sm:w-60 md:w-72 lg:w-80 xl:w-96 h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 xs:p-4 md:p-6 lg:p-8 border border-white/50 shadow-lg">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 xs:mb-4 md:mb-6" style={{ color: '#C17B3A' }}>
                Offline активности
              </h3>
              
              <div className="space-y-2 xs:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Принимаем партнерские предложения</p>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Устраиваем встречи с комьюнити</p>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 xs:p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Разрабатываем мероприятия</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Дизайн секция
const DesignSection = () => {
  return (
    <section className="bg-white relative flex flex-col md:flex-row min-h-screen">
      {/* Заголовок по центру с адаптивностью */}
      <div className="absolute top-2 xs:top-3 sm:top-4 md:top-6 lg:top-8 xl:top-12 left-1/2 transform -translate-x-1/2 z-50">
        <motion.h2 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-gray-900 mb-2 xs:mb-4 sm:mb-6 leading-none text-center px-2 xs:px-3 sm:px-5"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          ДИЗАЙН
        </motion.h2>
      </div>
      
      {/* Левая часть - белая */}
      <div className="w-full md:w-1/2 bg-white relative z-40 min-h-[50vh] md:min-h-full">
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-12 xs:pt-14 sm:pt-16 md:pt-20 lg:pt-24 h-full flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 xs:space-y-6 md:space-y-8 flex-1"
          >
            {/* Гайдбук секция */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Гайдбук
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-2 xs:mb-4">
                Наша команда дизайнеров разработала:
              </p>
              <div className="space-y-1 xs:space-y-2 text-sm sm:text-base md:text-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Персонаж-маскот</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Фирменные цвета</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Логотип</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Паттерны</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Шрифты</span>
                </div>
              </div>
            </div>

            {/* Фотографии кружек - увеличенные */}
            <div className="flex gap-3 xs:gap-4 md:gap-6 justify-center">
              <LazyImage 
                src="/img/projects/design-cup-decor2.webp" 
                alt="Design cup decoration 2" 
                className="w-20 xs:w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-auto object-contain transform rotate-12 hover:rotate-6 transition-transform duration-300"
              />
              <LazyImage 
                src="/img/projects/design-cup.webp" 
                alt="Design cup" 
                className="w-20 xs:w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-auto object-contain transform -rotate-6 hover:-rotate-3 transition-transform duration-300"
              />
            </div>

            {/* Мануал изображение - увеличенное */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-manual.png" 
                alt="Design manual" 
                className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain"
              />
            </div>

            {/* Меню секция */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Меню
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-800">
                Придерживаясь единого стиля, было создано новое оформление меню
              </p>
            </div>

            {/* Дополнительные фото - увеличенные */}
            <div className="space-y-4 xs:space-y-5">
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/design-cup-decor3.webp" 
                  alt="Design cup decoration 3" 
                  className="w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 h-auto object-contain transform rotate-6 hover:rotate-3 transition-transform duration-300"
                />
              </div>
              
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/design-post.webp" 
                  alt="Design post" 
                  className="w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-auto object-contain"
                />
              </div>
            </div>

            {/* Оформление в кофейне */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Оформление в кофейне
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-2 xs:mb-4">
                Для поддержания уюта наша команда создала печатную продукцию для нашего клиента:
              </p>
              <div className="space-y-1 xs:space-y-2 text-sm sm:text-base md:text-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Этикетки</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Флаеры</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Оформление стаканчиков</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Мокап</span>
                </div>
              </div>
            </div>

            {/* Униформа фото - увеличенная */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-uniform.webp" 
                alt="Design uniform" 
                className="w-36 xs:w-40 sm:w-44 md:w-48 lg:w-52 xl:w-60 h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Правая часть - amber-300 */}
      <div className="w-full md:w-1/2 bg-amber-300 relative z-40 min-h-[50vh] md:min-h-full">
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-12 xs:pt-14 sm:pt-16 md:pt-20 lg:pt-24 h-full flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 xs:space-y-6 md:space-y-8 flex-1"
          >
            {/* Стикеры изображение - увеличенное */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-stickers.webp" 
                alt="Design stickers" 
                className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain"
              />
            </div>

            {/* Мануал для бариста */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Мануал для бариста
              </h3>
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 xs:p-3 sm:p-4 border border-black/20">
                <p className="text-sm sm:text-base md:text-lg text-gray-900">
                  Для улучшения работы внутри кофейни был создан документ для обучения новых сотрудников (внутренняя обертка-обучение)
                </p>
              </div>
            </div>

            {/* Меню изображение - увеличенное */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-menu.webp" 
                alt="Design menu" 
                className="w-44 xs:w-52 sm:w-60 md:w-68 lg:w-76 xl:w-84 h-auto object-contain"
              />
            </div>

            {/* Рекламный материал */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Рекламный материал
              </h3>
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 xs:p-3 sm:p-4 border border-black/20">
                <p className="text-sm sm:text-base md:text-lg text-gray-900">
                  Мы также разработали рекламные баннеры, лайтбоксы и брошюры
                </p>
              </div>
            </div>

            {/* Декор изображение - увеличенное */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-decor.jpg" 
                alt="Design decor" 
                className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain"
              />
            </div>

            {/* Униформа */}
            <div className="space-y-2 xs:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                Униформа
              </h3>
              <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 xs:p-3 sm:p-4 border border-black/20">
                <p className="text-sm sm:text-base md:text-lg text-gray-900">
                  Также были разработана униформа для бариста
                </p>
              </div>
            </div>

            {/* Кофе изображение - увеличенное */}
            <div className="flex justify-center">
              <LazyImage 
                src="/img/projects/design-cofee.webp" 
                alt="Design coffee" 
                className="w-36 xs:w-40 sm:w-44 md:w-48 lg:w-52 xl:w-60 h-auto object-contain transform -rotate-3 hover:-rotate-1 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Веб разработка секция
const WebDevelopmentSection = () => {
  return (
    <section className="bg-white relative flex flex-col lg:flex-row min-h-screen">
      {/* Заголовок по центру с увеличенными отступами */}
      <div className="absolute top-4 xs:top-6 sm:top-8 md:top-12 lg:top-16 xl:top-20 left-1/2 transform -translate-x-1/2 z-50">
        <motion.h2 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-gray-800 mb-4 xs:mb-6 sm:mb-8 md:mb-12 lg:mb-16 leading-none text-center px-2 xs:px-4 md:px-8 lg:px-10"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '1rem',
            marginBottom: '2rem'
          }}
        >
          ВЕБ РАЗРАБОТКА
        </motion.h2>
      </div>
      
      {/* Левая часть - orange-100 с градиентом */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-50 to-orange-100 relative z-40 min-h-[50vh] lg:min-h-full">
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 h-full flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 xs:space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 flex-1"
          >
            {/* Новый дизайн для сайта */}
            <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 font-montserrat">
                Новый дизайн для сайта
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed font-montserrat">
                  Разработан новый дизайн для веб сайта с адаптацией на разных устройствах
                </p>
              </div>
            </div>

            {/* Телефон изображение - увеличенное */}
            <div className="flex justify-center py-3 xs:py-4 sm:py-5 md:py-6">
              <LazyImage 
                src="/img/projects/phone1.webp" 
                alt="Phone design" 
                className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 2xl:w-48 h-auto object-contain transform rotate-3 hover:rotate-6 transition-transform duration-300"
              />
            </div>

            {/* Mac изображения с улучшенным spacing */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac3.webp" 
                  alt="Mac design 3" 
                  className="w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-52 2xl:w-60 h-auto object-contain transform -rotate-2 hover:-rotate-3 transition-transform duration-300"
                />
              </div>
              
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac4.webp" 
                  alt="Mac design 4" 
                  className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48 2xl:w-56 h-auto object-contain transform rotate-1 hover:rotate-2 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Админ панель секция с улучшенным дизайном */}
            <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 font-montserrat">
                Админ панель
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed font-montserrat">
                  Также разработана админ панель с автоматизацией заполнения в google таблицах
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Правая часть - белая с тонким градиентом */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-white to-gray-50 relative z-40 min-h-[50vh] lg:min-h-full">
        <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 h-full flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 xs:space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 flex-1"
          >
            {/* Mac изображения сверху с улучшенным spacing */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac-1.webp" 
                  alt="Mac CMS 1" 
                  className="w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-52 2xl:w-60 h-auto object-contain transform rotate-2 hover:rotate-3 transition-transform duration-300"
                />
              </div>
              
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac1-2.webp" 
                  alt="Mac CMS 2" 
                  className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48 2xl:w-56 h-auto object-contain transform -rotate-1 hover:-rotate-2 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Система управления контентом с улучшенным дизайном */}
            <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 font-montserrat">
                Система управления контентом
              </h3>
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed font-montserrat">
                  Разработана современная CMS для управления контентом с интуитивным интерфейсом
                </p>
              </div>
            </div>

            {/* Дополнительные Mac изображения с улучшенным spacing */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac3.webp" 
                  alt="Mac system 3" 
                  className="w-26 xs:w-30 sm:w-34 md:w-38 lg:w-42 xl:w-48 2xl:w-54 h-auto object-contain transform rotate-1 hover:rotate-2 transition-transform duration-300"
                />
              </div>
              
              <div className="flex justify-center">
                <LazyImage 
                  src="/img/projects/mac5.webp" 
                  alt="Mac system 5" 
                  className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-46 2xl:w-52 h-auto object-contain transform -rotate-2 hover:-rotate-3 transition-transform duration-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CasePage = () => {
  const containerRef = useRef(null);
  const seoData = useSEO('project');

  return (
    <>
      {seoData && <SEOHead {...seoData} />}
      
      {/* Основная структура страницы */}
      <div className="min-h-screen flex flex-col case-page-container">
        <div ref={containerRef} className="relative flex-1 bg-gradient-to-b from-gray-50 to-gray-100 performance-optimized">
          {/* Контент-слои */}
          <div className="relative z-10">
            {/* Hero секция */}
            <HeroSection />
            
            {/* Остальные секции */}
            <ContentSection />
            <MarketingSection />
            <DesignSection />
            <WebDevelopmentSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default CasePage;