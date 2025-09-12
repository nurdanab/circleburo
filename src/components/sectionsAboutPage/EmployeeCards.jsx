import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StructuredData from '../StructuredData';

const employeeKeys = [
  'employee1', 'employee2', 'employee3', 'employee4', 'employee5',
  'employee6', 'employee7', 'employee8', 'employee9', 'employee10', 
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
  
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    
    rotateY.set(offsetX * 8);
    rotateX.set(-offsetY * 8);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-[280px] h-[360px] flex-shrink-0 perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          zIndex: isHovered ? 50 : 1
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
        
        {/* Redesigned content container */}
        <div className="relative z-10 h-full flex flex-col p-5">
          {/* Large centered avatar */}
          <div className="flex flex-col items-center mb-5">
            <motion.div
              className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-full p-1"
                style={{ 
                  background: `linear-gradient(135deg, 
                    ${colorScheme.accentColor}60, 
                    ${colorScheme.accentColor}20)`
                }}
              >
                <div className="w-full h-full rounded-full bg-gray-900 p-1 overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'center center',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="text-center">
              <h3 className="text-base font-medium text-white leading-tight mb-1">
                {employee.name}
              </h3>
              <motion.p 
                className="text-xs font-normal"
                animate={{ 
                  color: isHovered ? colorScheme.accentColor : '#9ca3af'
                }}
                transition={{ duration: 0.3 }}
              >
                {employee.specialty}
              </motion.p>
            </div>
          </div>
          
          {/* Simple divider */}
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
          
          {/* Compact content area */}
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-gray-400 text-xs leading-relaxed text-center mb-3 line-clamp-2 px-2">
              {employee.bio}
            </p>
            
            {/* Minimal footer */}
            <div className="text-center">
              <p className="text-gray-500 text-xs font-light opacity-70">
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

  return (
    <section className="bg-black py-20 text-white relative overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-white via-purple-200 to-purple-400"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          >
            {t('employeeCards.title')}
          </motion.h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('employeeCards.subtitle')}
          </p>
        </motion.div>

        {/* Cards - Horizontal scroll container with enhanced styling */}
        <div className="relative overflow-x-auto scrollbar-hide">
          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
          
          {/* Enhanced cards container */}
          <motion.div 
            className="flex gap-8 sm:gap-10 lg:gap-12 px-8 py-16 min-w-max"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {employeeKeys.map((employeeKey, index) => (
              <AnimatedEmployeeCard 
                key={employeeKey} 
                employeeKey={employeeKey}
                index={index}
                t={t}
              />
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      
      {/* Enhanced CSS for smooth scrolling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
        }
        .scrollbar-hide > div {
          scroll-snap-align: start;
        }
        @media (prefers-reduced-motion: no-preference) {
          .scrollbar-hide {
            scroll-behavior: smooth;
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default AnimatedEmployeeCards;