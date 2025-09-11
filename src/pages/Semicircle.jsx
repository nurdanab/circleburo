import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';

const SemiCircle = () => {
  const seoData = useSEO('semicircle'); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Прокрутка к началу страницы при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Функция для навигации к секции контактов на главной странице
  const scrollToSection = (sectionId) => {
    navigate('/', { state: { scrollTo: sectionId } });
  };

  // Опция { returnObjects: true } позволяет получить массив объектов
  const designItems = t('semicircle.design.items', { returnObjects: true });

  return (
    <>
    {seoData && <SEOHead {...seoData} />}
      <Header />
      
      {/* Hero Section */}
      <section className="bg-neutral-950 text-white min-h-screen pt-30 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
              SEMICIRCLE
            </h1>
            <p className="text-white mt-5">            
              {t('services.semicircle.description')}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-start">
      
            {/* Левая колонка - Marketing & SMM */}
            <div className="space-y-12 lg:col-span-4">
              
              {/* Карточка Marketing */}
              <motion.div
                className="bg-neutral-800 rounded-2xl p-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('semicircle.marketing.title')}</h2>
                <div className="space-y-8">
                  <div className="flex justify-between items-start space-x-4">
                    <p className="text-gray-300">{t('semicircle.marketing.item1')}</p>
                    <span className="text-2xl font-bold text-white">{t('semicircle.marketing.item1Price')}</span>
                  </div>
                  <div className="flex justify-between items-start space-x-4">
                    <p className="text-gray-300">{t('semicircle.marketing.item2')}</p>
                    <span className="text-2xl font-bold text-white">{t('semicircle.marketing.item2Price')}</span>
                  </div>
                  <div className="flex justify-between items-start space-x-4">
                    <p className="text-gray-300">{t('semicircle.marketing.item3')}</p>
                    <span className="text-2xl font-bold text-white">{t('semicircle.marketing.item3Price')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Карточка SMM */}
              <motion.div
                className="bg-neutral-800 rounded-2xl p-10 flex flex-col justify-between"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6">{t('semicircle.smm.title')}</h2>
                  <div className="space-y-8">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-300">{t('semicircle.smm.item1')}</p>
                    </div>
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-gray-300">{t('semicircle.smm.item2')}</p>
                      </div>
                      <span className="text-2xl font-bold text-white">{t('semicircle.smm.item2Count')}</span>
                    </div>
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-gray-300">{t('semicircle.smm.item3')}</p>
                          <p className="text-gray-400 mt-1">{t('semicircle.smm.item3Sub')}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-white">{t('semicircle.smm.item3Count')}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-300">{t('semicircle.smm.item4')}</p>
                    </div>
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                        <p className="text-gray-300">{t('semicircle.smm.item5')}</p>
                      </div>
                      <span className="text-2xl font-bold text-white">{t('semicircle.smm.item5Count')}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-3 border-t border-neutral-700">
                  <p className="text-3xl font-bold text-white">{t('semicircle.smm.totalPrice')} / {t('semicircle.smm.days')}</p>
                </div>
              </motion.div>
            </div>

            {/* Правая колонка - Design & Production */}
            <div className="space-y-12 lg:col-span-6">
              
              {/* Карточка Design */}
              <motion.div
                className="bg-neutral-800 rounded-2xl p-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('semicircle.design.title')}</h2>
                <div className="grid gap-6">
                  {designItems && Array.isArray(designItems) && designItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-gray-300">
                      <div className="flex-1 max-w-[45%]">
                        {/* ⚠️ Примечание: Мы напрямую используем item.service, потому что i18next уже вернул нам готовый объект */}
                        <p>{item.service}</p>
                      </div>
                      <div className="flex justify-between items-start flex-1">
                        <span className="flex-1 text-start">{item.pages}</span>
                        <span className="flex-1 text-start">{item.time}</span>
                        <span className="text-white text-1xl font-medium flex-1 text-start">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Карточка Production */}
              <motion.div
                className="bg-neutral-800 rounded-2xl p-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('semicircle.production.title')}</h2>
                <div className="grid gap-6">
                  <div className="flex justify-between items-start text-gray-300">
                    <div className="flex-1 max-w-[50%]">
                      <p>{t('semicircle.production.item1')}</p>
                    </div>
                    <div className="flex justify-between items-center flex-1">
                      <span className="flex-1 text-center">{t('semicircle.production.item1Count')}</span>
                      <span className="flex-1 text-center">{t('semicircle.production.item1Time')}</span>
                      <span className="text-white text-2xl font-bold flex-1 text-right">{t('semicircle.production.item1Price')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start text-gray-300">
                    <div className="flex-1 max-w-[50%]">
                      <p>{t('semicircle.production.item2')}</p>
                    </div>
                    <div className="flex justify-between items-center flex-1">
                      <span className="flex-1 text-center">{t('semicircle.production.item2Count')}</span>
                      <span className="flex-1 text-center">{t('semicircle.production.item2Time')}</span>
                      <span className="text-white text-2xl font-bold flex-1 text-right">{t('semicircle.production.item2Price')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start text-gray-300">
                    <div className="flex-1 max-w-[50%]">
                      <p>{t('semicircle.production.item3')}</p>
                    </div>
                    <div className="flex justify-between items-center flex-1">
                      {/* <span className="flex-1 text-center">{t('semicircle.production.item2Count')}</span>
                      <span className="flex-1 text-center">{t('semicircle.production.item2Time')}</span> */}
                      <span className="text-white text-2xl font-bold flex-1 text-right">{t('semicircle.production.item3Price')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section with graphics and notes */}
          <div className="mt-1 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-0">
            
            {/* Left side - Graphic element */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-start min-h-screen">
              <div className="w-96 h-96 relative">
                
                {/* PRODUCTION */}
                <motion.div
                  className="absolute inset-0 bg-cover cursor-pointer"
                  style={{
                    clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)',
                    borderRadius: '50%',
                    backgroundImage: `url('/img/prod.png')`
                  }}
                  whileHover={{ x: -20, y: -20, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                {/* MARKETING */}
                <motion.div
                  className="absolute inset-0 bg-cover cursor-pointer"
                  style={{
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                    borderRadius: '50%',
                    backgroundImage: `url('/img/marketing.png')`
                  }}
                  whileHover={{ x: 20, y: -20, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                {/* SMM */}
                <motion.div 
                  className="absolute inset-0 bg-cover cursor-pointer"
                  style={{
                    clipPath: 'polygon(50% 50%, 0% 50%, 0% 100%, 50% 100%)',
                    borderRadius: '50%',
                    backgroundImage: `url('/img/smm.png')`
                  }}
                  whileHover={{ x: -20, y: 20, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                {/* DESIGN */}
                <motion.div 
                  className="absolute inset-0 bg-cover cursor-pointer"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)',
                    borderRadius: '50%',
                    backgroundImage: `url('/img/design.png')`
                  }}
                  whileHover={{ x: 20, y: 20, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />
              </div>
            </div>

            {/* Right side - Notes & CTA */}
            <div className="space-y-6 text-white w-full lg:w-1/2">
              <p>{t('semicircle.notes.note1')}</p>
              <p>{t('semicircle.notes.note2')}</p>
              <p>{t('semicircle.notes.note3')}</p>
              <p>{t('semicircle.notes.note4')}</p>
              <p>{t('semicircle.notes.note5')}</p>
              <p>{t('semicircle.notes.note6')}</p>
              <p>{t('semicircle.notes.note7')}</p>
              
              <div className="mt-8 pt-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-white text-black px-12 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors duration-300"
                >
                  {t('nav.contact')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SemiCircle;