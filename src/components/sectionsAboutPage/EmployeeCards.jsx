import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StructuredData from '../StructuredData';

const employeeKeys = [
  'employee1', 'employee2', 'employee3', 'employee4', 'employee5',
  'employee6', 'employee8', 'employee9',
  'employee11', 'employee12', 'employee13', 'employee14',
];

const colorSchemes = [
  { gradient: 'linear-gradient(135deg, #6b7280, #4b5563)', accentColor: '#9ca3af', borderColor: 'rgba(156, 163, 175, 0.15)' },
  { gradient: 'linear-gradient(135deg, #64748b, #475569)', accentColor: '#94a3b8', borderColor: 'rgba(148, 163, 184, 0.15)' },
  { gradient: 'linear-gradient(135deg, #71717a, #52525b)', accentColor: '#a1a1aa', borderColor: 'rgba(161, 161, 170, 0.15)' },
  { gradient: 'linear-gradient(135deg, #78716c, #57534e)', accentColor: '#a8a29e', borderColor: 'rgba(168, 162, 158, 0.15)' },
  { gradient: 'linear-gradient(135deg, #737373, #525252)', accentColor: '#a3a3a3', borderColor: 'rgba(163, 163, 163, 0.15)' },
  { gradient: 'linear-gradient(135deg, #6b7280, #374151)', accentColor: '#9ca3af', borderColor: 'rgba(156, 163, 175, 0.12)' },
];

// Компонент анимированной карточки
const AnimatedEmployeeCard = ({ employeeKey, index, t }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  // Определяем мобильное устройство сразу
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const employee = {
    name: t(`employeeCards.${employeeKey}.name`),
    specialty: t(`employeeCards.${employeeKey}.specialty`),
    email: t(`employeeCards.${employeeKey}.email`),
    bio: t(`employeeCards.${employeeKey}.bio`),
    image: t(`employeeCards.${employeeKey}.image`),
  };

  const colorScheme = colorSchemes[index % colorSchemes.length];

  // Уникальные креативные формы для каждой карточки
  const creativeShapes = [
    { transform: 'rotate(45deg)', top: '10px', right: '10px' },
    { borderRadius: '50%', top: '15px', right: '15px' },
    { borderRadius: '0 100% 0 0', top: '0', right: '0' },
    { transform: 'rotate(30deg)', borderRadius: '20%', top: '12px', right: '12px' },
    { borderRadius: '100% 0 100% 0', top: '10px', right: '10px' },
    { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', top: '8px', right: '8px' },
  ];

  const creativeShape = creativeShapes[index % creativeShapes.length];

  // Springs только для десктопа
  const rotateX = !isMobile ? useSpring(0, { stiffness: 100, damping: 30 }) : null;
  const rotateY = !isMobile ? useSpring(0, { stiffness: 100, damping: 30 }) : null;

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current || !rotateX || !rotateY) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    rotateY.set(offsetX * 8);
    rotateX.set(-offsetY * 8);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && rotateX && rotateY) {
      setIsHovered(false);
      rotateX.set(0);
      rotateY.set(0);
    }
  };

  // Рендер для мобильных (максимально упрощенный)
  if (isMobile) {
    return (
      <div className="w-[280px] min-h-[420px] flex-shrink-0">
        <div
          className="w-full h-full bg-gray-900/40 border border-gray-700/30 rounded-xl p-4 flex flex-col"
        >
          {/* Card number */}
          <div
            className="text-xs font-medium mb-3 text-right"
            style={{ color: colorScheme.accentColor }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-3 bg-gray-700">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: employeeKey === 'employee4' ? 'left top' : employeeKey === 'employee1' ? 'right top' : employeeKey === 'employee2' ? 'center center' : employeeKey === 'employee9' ? 'center center' : 'center top',
                }}
                loading="lazy"
                decoding="async"
              />
            </div>

            <h3 className="text-base font-medium text-white text-center mb-1">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-400 text-center">
              {employee.specialty}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700/50 w-12 mx-auto mb-3" />

          {/* Bio */}
          <div className="flex-1">
            <p className="text-gray-400 text-sm leading-relaxed text-center">
              {employee.bio}
            </p>
          </div>

          {/* Email */}
          <div className="text-center pt-3 mt-auto">
            <p className="text-gray-500 text-xs">
              {employee.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Рендер для десктопа (с анимациями)
  return (
    <motion.div
      ref={cardRef}
      className="relative w-[280px] min-h-[440px] flex-shrink-0 lazy-below-fold"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '280px 440px',
      }}
    >
      {/* Unique creative accent */}
      <motion.div
        className="absolute w-8 h-8 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.accentColor}, ${colorScheme.accentColor}60)`,
          ...creativeShape
        }}
        animate={{
          opacity: isHovered ? 0.4 : 0.2,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="relative w-full h-full overflow-hidden bg-gray-900/40 backdrop-blur-md border border-gray-700/30 rounded-2xl"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          zIndex: isHovered ? 50 : 1,
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          borderColor: isHovered ? colorScheme.borderColor : 'rgba(55, 65, 81, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Geometric accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: colorScheme.gradient }}
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scaleX: isHovered ? 1 : 0.7
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Side accent bar */}
        <motion.div
          className="absolute top-4 left-0 w-1 h-12 rounded-r-full"
          style={{ backgroundColor: colorScheme.accentColor }}
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            height: isHovered ? '60px' : '48px'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Card number */}
        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-xs font-medium"
          style={{ color: colorScheme.accentColor }}
          animate={{
            borderColor: isHovered ? colorScheme.accentColor : '#4b5563',
            backgroundColor: isHovered ? `${colorScheme.accentColor}10` : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Content container */}
        <div className="relative z-10 h-full flex flex-col p-5">
          <div className="flex flex-col items-center mb-5">
            <motion.div
              className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="absolute inset-0 rounded-full p-1"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.accentColor}60, ${colorScheme.accentColor}20)`
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-1 overflow-hidden border-2 border-gray-300">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      style={{
                        objectPosition: employeeKey === 'employee4' ? 'left top' : employeeKey === 'employee1' ? 'right top' : employeeKey === 'employee2' ? 'center center' : employeeKey === 'employee9' ? 'center center' : 'center top',
                        objectFit: 'cover',
                        willChange: 'transform'
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-white leading-tight mb-2">
                {employee.name}
              </h3>
              <motion.p
                className="text-sm font-normal"
                animate={{
                  color: isHovered ? colorScheme.accentColor : '#9ca3af'
                }}
                transition={{ duration: 0.3 }}
              >
                {employee.specialty}
              </motion.p>
            </div>
          </div>

          <div className="relative mb-4">
            <motion.div
              className="h-px bg-gray-600 w-16 mx-auto"
              animate={{
                backgroundColor: isHovered ? colorScheme.accentColor : '#4b5563',
                width: isHovered ? '80px' : '64px'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1 mb-4">
              <p className="text-gray-400 text-sm leading-relaxed text-center px-2">
                {employee.bio}
              </p>
            </div>

            <div className="text-center mt-auto pt-3">
              <p className="text-gray-500 text-sm font-light opacity-70">
                {employee.email}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Основной компонент
const AnimatedEmployeeCards = () => {
  const { t } = useTranslation();
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const scrollContainerRef = useRef(null);

  // Прокрутка вверх при монтировании компонента
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Лёгкий momentum scroll для улучшения отклика на мобильных
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let touchStartX = 0;
    let touchStartTime = 0;
    let touchEndX = 0;
    let touchEndTime = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndTime = Date.now();

      const distance = touchStartX - touchEndX;
      const duration = touchEndTime - touchStartTime;

      // Вычисляем скорость свайпа (пиксели/мс)
      const velocity = Math.abs(distance) / duration;

      // Снижаем порог для более лёгкого срабатывания и увеличиваем duration
      if (velocity > 0.3 && duration < 400) {
        // Увеличиваем множитель инерции для более плавной прокрутки
        const momentum = distance * Math.min(velocity * 2.5, 5);

        // Плавная прокрутка с инерцией
        container.scrollBy({
          left: momentum,
          behavior: 'smooth'
        });
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  return (
    <section className="bg-black py-20 text-white relative" style={{ overflow: 'hidden', zIndex: 1, position: 'relative', isolation: 'auto', transform: 'none', willChange: 'auto' }}>
      {/* Structured Data for each employee */}
      {employeeKeys.map((employeeKey) => {
        const employee = {
          name: t(`employeeCards.${employeeKey}.name`),
          specialty: t(`employeeCards.${employeeKey}.specialty`),
          email: t(`employeeCards.${employeeKey}.email`),
          bio: t(`employeeCards.${employeeKey}.bio`),
          image: t(`employeeCards.${employeeKey}.image`),
        };
        return (
          <StructuredData
            key={employeeKey}
            type="person"
            data={employee}
          />
        );
      })}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {isMobile ? (
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t('employeeCards.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 text-center leading-relaxed">
              {t('employeeCards.subtitle')}
            </p>
          </div>
        ) : (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-white via-purple-200 to-purple-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              {t('employeeCards.title')}
            </motion.h1>
            <p className="text-base sm:text-lg text-gray-300 text-center leading-relaxed">
              {t('employeeCards.subtitle')}
            </p>
          </motion.div>
        )}

        {/* Cards - Horizontal scroll container with enhanced styling */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isMobile ? 'default' : 'grab',
            // Критично для плавной нативной прокрутки
            touchAction: 'pan-x',
          }}
        >
          {/* Gradient overlays for scroll indication - скрываем на мобильных */}
          {!isMobile && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
            </>
          )}

          {/* Enhanced cards container */}
          <div
            className="flex px-8 py-16 min-w-max"
            style={{
              gap: isMobile ? '16px' : '24px',
            }}
          >
            {employeeKeys.map((employeeKey, index) => (
              <AnimatedEmployeeCard
                key={employeeKey}
                employeeKey={employeeKey}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient - ensure it doesn't block touch */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" style={{ zIndex: 1 }} />

      {/* Enhanced CSS for smooth scrolling */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          /* Критично для предотвращения скролла родительских элементов */
          overscroll-behavior-x: contain;
          overscroll-behavior-y: none;
          /* Отключаем scroll snap для избежания рывков */
          scroll-snap-type: none;
          /* Плавная прокрутка для всех устройств */
          scroll-behavior: smooth;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Оптимизация специально для мобильных устройств */
        @media (max-width: 768px) {
          .scrollbar-hide {
            /* Критично для iOS - нативная плавная прокрутка */
            -webkit-overflow-scrolling: touch;
            /* Аппаратное ускорение */
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
            /* Убираем GPU throttling для более отзывчивой прокрутки */
            will-change: scroll-position;
          }

          /* Упрощаем рендеринг карточек */
          .scrollbar-hide > div > div {
            contain: layout style;
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
          }

          /* Убираем backdrop-blur на мобильных для повышения производительности */
          .scrollbar-hide .backdrop-blur-md {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }
      `}</style>
    </section>
  );
};

export default AnimatedEmployeeCards;
