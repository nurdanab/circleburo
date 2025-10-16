import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../OptimizedImage';

const AboutUsSection = () => {
  const { t } = useTranslation();
  const circleRef = useRef(null);
  const desktopCircleRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const rotateValue = useTransform(scrollYProgress, [0, 1], [100, 504]);
  const opacityValue = useTransform(sectionProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  return (
    <section 
      ref={sectionRef}
      className="bg-black text-gray-300 py-20 md:py-32 px-6 md:px-20 relative overflow-hidden min-h-screen flex items-center"
    >

      {/* Мобильная версия круга скрыта для оптимизации */}
      {/* <motion.div
        className="absolute top-0 right-0 lg:hidden z-0"
      >
        <div className="relative w-[20rem] h-[20rem] overflow-hidden">
          <motion.div
            ref={circleRef}
            className="relative w-full h-full translate-x-1/2"
            style={{ rotate: rotateValue }}
          >
            <OptimizedImage
              src="/img/circle-vectorrr-w.webp"
              alt="Circle Logo"
              className="w-full h-full object-contain filter drop-shadow-2xl"
              priority={false}
            />
          </motion.div>
        </div>
      </motion.div> */}

      <motion.div 
        className="hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 z-0"
      >
        <div className="relative w-[40rem] h-[40rem] xl:w-[50rem] xl:h-[50rem] overflow-hidden">
          <motion.div
            ref={desktopCircleRef}
            className="relative w-full h-full translate-x-1/2"
            style={{ rotate: rotateValue }}
          >
            <OptimizedImage
              src="/img/circle-vectorrr-w.webp"
              alt="Circle Logo"
              className="w-full h-full object-contain filter drop-shadow-2xl"
              priority={false}
            />
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 lg:gap-20 items-center relative">
          <motion.div 
            className="flex flex-col space-y-8 relative z-10 max-w-3xl"
            style={{ opacity: opacityValue }}
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm uppercase tracking-widest text-white backdrop-blur-sm">
                {t('aboutUs.subtitle')}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                {t('aboutUs.creative')}{' '}
                <span className="block text-white">
                  {t('aboutUs.vision')}
                </span>
              </h2>
            </motion.div>

            <motion.div
              className="space-y-6 text-white text-lg md:text-xl leading-relaxed max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p>
                {t('aboutUs.paragraph1')}
              </p>
              <p className="text-white">
                {t('aboutUs.paragraph2')}
              </p>
            </motion.div>

            
            
            {/* Обновленная кнопка с навигацией */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Link
              to="/about"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <motion.button 
                  className="group relative px-10 py-5 bg-gradient-to-r from-white to-gray-100 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 overflow-hidden btn-dark-theme"
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t('aboutUs.button')}
                    <motion.svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </motion.svg>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;