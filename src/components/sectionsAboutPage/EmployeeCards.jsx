import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const employeeKeys = [
  'employee1', 'employee2', 'employee3', 'employee4', 'employee5',
  'employee6', 'employee7', 'employee8', 'employee9', 'employee10',
  
];

const colorSchemes = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accentColor: '#667eea' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accentColor: '#f093fb' },
  { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accentColor: '#4facfe' },
  { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', accentColor: '#43e9d7' },
  { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accentColor: '#fa709a' },
  { gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', accentColor: '#a8edea' },
  { gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accentColor: '#fcb69f' },
  { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accentColor: '#ff9a9e' },
  { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accentColor: '#a18cd1' },
  { gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', accentColor: '#fad0c4' },
//   { gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accentColor: '#ffecd2' },
//   { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accentColor: '#89f7fe' },
//   { gradient: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)', accentColor: '#fdbb2d' },
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
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const glowOpacity = useSpring(0, { stiffness: 7, damping: 120 });
  
  const gradientX = useTransform(mouseX, [0, 1], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(offsetX);
    mouseY.set(offsetY);
    rotateY.set(offsetX * 15);
    rotateX.set(-offsetY * 15);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.1);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    glowOpacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative min-w-[240px] h-[360px] md:min-w-[280px] md:h-[420px] perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute w-full h-full bg-neutral-900 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          zIndex: isHovered ? 50 : 1
        }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-3xl opacity-0 blur-xl"
          style={{
            background: colorScheme.gradient,
            opacity: 0.04
          }}
        />
        
        {/* Animated background gradient */}
        {/* <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${colorScheme.accentColor}40, transparent 70%)`
          }}
        /> */}
        
        {/* Shimmer effect */}
        {/* <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={isHovered ? { x: ['0%', '400%'] } : { x: '0%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        /> */}
        
        {/* Content container */}
        <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
          {/* Avatar section */}
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <motion.div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar glow */}
              <motion.div
                className="absolute -inset-2 rounded-full blur-lg opacity-0"
                style={{
                  background: colorScheme.gradient,
                  opacity: glowOpacity
                }}
              />
              
              {/* Avatar border */}
              <div 
                className="absolute inset-0 rounded-full p-1"
                style={{ background: colorScheme.gradient }}
              >
                <div className="w-full h-full rounded-full bg-gray-900 p-1">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Text content */}
          <div className="text-center flex-grow flex flex-col justify-center">
            <motion.h3 
              className="text-xl md:text-2xl font-bold text-white mb-2"
              animate={{ color: isHovered ? colorScheme.accentColor : '#ffffff' }}
              transition={{ duration: 0.3 }}
            >
              {employee.name}
            </motion.h3>
            
            <p className="text-gray-300 text-sm font-medium mb-3">
              {employee.specialty}
            </p>
            
            <motion.div
              className="w-16 h-0.5 mx-auto mb-4 rounded-full"
              style={{ backgroundColor: colorScheme.accentColor }}
              animate={{ width: isHovered ? '100px' : '64px' }}
              transition={{ duration: 0.3 }}
            />
            
            <p className="text-gray-400 text-xs mb-4">
              {employee.email}
            </p>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {employee.bio}
            </p>
          </div>
        </div>
        
        {/* Floating particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: colorScheme.accentColor }}
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: '100%',
                  opacity: 0
                }}
                animate={{
                  y: '-20%',
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Основной компонент
const AnimatedEmployeeCards = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-black py-20 text-white relative overflow-hidden">
     
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

        {/* Cards - Horizontal scroll container */}
        <div className="overflow-x-auto scrollbar-hide">
          {/* Увеличиваем отступы, чтобы избежать обрезки при наведении */}
          <div className="flex gap-8 sm:gap-10 px-6 py-12 min-w-max">
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
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      
      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AnimatedEmployeeCards;