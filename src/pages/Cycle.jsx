import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import { navigateToSection } from '../utils/navigation';

// Это основной компонент для страницы Cycle
const Cycle = () => {
  const seoData = useSEO('cycle');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Функция для навигации к секции контактов на главной странице
  const scrollToSection = (sectionId) => {
    navigateToSection(navigate, location.pathname, '/', sectionId, {
      maxAttempts: 15,
      delay: 150,
      offset: 80
    });
  };
  return (
    <>
    {seoData && <SEOHead {...seoData} />}

      {/* Главная секция страницы с тёмным фоном */}
      <section className="bg-neutral-950 text-white min-h-screen pt-30 px-4 pb-0">
        <div className="max-w-7xl mx-auto pb-16">
          
          {/* Секция с заголовком и описанием */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
              CYCLE
            </h1>
            <p className="text-white mt-5 text-center">
            {t('services.cycle.description')}
            </p>
          </motion.div>

          {/* Контейнер для блоков с услугами */}
          <motion.div
            className="bg-neutral-800 rounded-2xl p-12 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Блок Social Media */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('cycle.socialMedia.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-300">{t('cycle.socialMedia.item1')}</p>
                    <p className="text-gray-400 text-sm ml-2 mt-1">{t('cycle.socialMedia.item1Sub')}</p>
                  </div>
                  <p className="text-gray-300">{t('cycle.socialMedia.item2')}</p>
                  <p className="text-gray-300">{t('cycle.socialMedia.item3')}</p>
                </div>
              </div>

              {/* Блок Design */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('cycle.design.title')}</h2>
                <div className="space-y-4">
                  <p className="text-gray-300">{t('cycle.design.item1')}</p>
                  <p className="text-gray-300">{t('cycle.design.item2')}</p>
                  <p className="text-gray-300">{t('cycle.design.item3')}</p>
                </div>
              </div>

              {/* Блок Digital-Services */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('cycle.digitalServices.title')}</h2>
                <div className="space-y-4">
                <p className="text-gray-300">{t('cycle.digitalServices.item1')}</p>
                  <p className="text-gray-300">{t('cycle.digitalServices.item2')}</p>
                  <p className="text-gray-300">{t('cycle.digitalServices.item3')}</p>
                  <p className="text-gray-300">{t('cycle.digitalServices.item4')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Секция с общей ценой и скидкой */}
          <motion.div
            className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-16 mb-16 text-center shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out
                       border border-neutral-700
                       before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:p-[2px] before:-z-10 before:opacity-0 hover:before:opacity-30 before:transition-opacity before:duration-300
                       "
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-8 text-white">{t('cycle.totalPrice.title')}</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
              <p className="text-3xl md:text-4xl font-semibold text-gray-300">
                Monthly
              </p>
              {/* Разделитель */}
              <div className="hidden md:block w-1 h-16 bg-white rounded-full"></div>
              <p className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                580 000 KZT
              </p>
            </div>
            <p className="text-2xl md:text-3xl text-gray-400 mt-6">
              Discount for purchasing "Circle" - <span className="text-white font-bold">380 000 KZT</span>
            </p>
          </motion.div>

          {/* Секция с коллажем и примечаниями */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12 mb-16">
            
            {/* Левая часть - изображение-коллаж */}
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-96 h-96 rounded-full overflow-hidden">
                {/* Используй свое изображение, как и на других страницах */}
                <img
                  src="/img/cycle-collage.png"
                  alt="Cycle Collage"
                  className="w-full h-full object-cover"
                  width={384}
                  height={384}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
            </motion.div>

            {/* Правая часть - примечания и кнопка */}
            <motion.div 
              className="space-y-6 text-white w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <p>{t('cycle.notes.note1')}</p>
              <p>{t('cycle.notes.note2')}</p>
              <p>{t('cycle.notes.note3')}</p>
              <p>{t('cycle.notes.note4')}</p>
              <p>{t('cycle.notes.note5')}</p>
              
              <div className="mt-8 pt-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-white text-black px-12 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors duration-300 btn-dark-theme"
                >
                  {t('nav.contact')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cycle;