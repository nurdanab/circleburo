import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import { navigateToSection } from '../utils/navigation';

const Circle = () => {
  const seoData = useSEO('circle'); 
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Прокрутка к началу страницы при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Функция для навигации к секции контактов на главной странице
  const scrollToSection = (sectionId) => {
    navigateToSection(navigate, location.pathname, '/', sectionId, {
      maxAttempts: 15,
      delay: 150,
      offset: 80
    });
  };

  const designGuidebookItems = t('circle.designGuidebook.items', { returnObjects: true });

  return (
    <>
    {seoData && <SEOHead {...seoData} pageName="services.circle" autoOptimize={true} />}
      <Header />
      
      {/* Hero Section */}
      <section className="bg-neutral-950 text-white min-h-screen pt-30 px-4 pb-0">
        <div className="max-w-7xl mx-auto pb-16">
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
              CIRCLE
            </h1>
            <p className="text-white mt-5 text-center">
              {t('services.circle.description')}
            </p>
          </motion.div>

          {/* Main Package Card */}
          <motion.div
            className="bg-neutral-800 rounded-2xl p-12 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Launch and PR */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('circle.launchPr.title')}</h2>
                <div className="space-y-4">
                  <p className="text-gray-300">{t('circle.launchPr.item1')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item2')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item3')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item4')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item5')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item6')}</p>
                  <p className="text-gray-300">{t('circle.launchPr.item7')}</p>
                </div>
              </div>

              {/* Social Media packaging */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('circle.socialMedia.title')}</h2>
                <div className="space-y-4">
                  <p className="text-gray-300">{t('circle.socialMedia.item1')}</p>
                  <p className="text-gray-300">{t('circle.socialMedia.item2')}</p>
                  <p className="text-gray-300">{t('circle.socialMedia.item3')}</p>
                  <p className="text-gray-300">{t('circle.socialMedia.item4')}</p>
                  <p className="text-gray-300">{t('circle.socialMedia.item5')}</p>
                  <p className="text-gray-300 italic">{t('circle.socialMedia.item6')}</p>
                </div>
              </div>

              {/* Design + Guidebook */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">{t('circle.designGuidebook.title')}</h2>
                <div className="space-y-3">
                {designGuidebookItems.map((item, index) => (
    <div key={index} className="flex justify-between items-start py-2">
      <p className="text-gray-200 flex-1 pr-4">{item.service}</p>
      <span className="text-white font-semibold text-right">{item.alterations}</span>
    </div>
  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Price Section */}
          <motion.div
            className="bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-3xl p-16 mb-16 border border-neutral-600"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">{t('circle.totalPrice.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-600">
                  <p className="text-6xl font-bold text-white mb-2">{t('circle.totalPrice.days')}</p>
                  <p className="text-xl text-gray-300 uppercase tracking-wider">{t('circle.totalPrice.daysLabel')}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-600">
                  <p className="text-5xl font-bold text-white mb-2">{t('circle.totalPrice.price')}</p>
                  <p className="text-xl text-gray-300 uppercase tracking-wider">{t('circle.totalPrice.currency')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section with Circle Collage and Notes */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12 mb-16">
            
            {/* Left side - Circle Collage */}
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-96 h-96 rounded-full overflow-hidden">
                <img 
                  src="/img/circle-collage.png" 
                  alt="Circle Collage" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right side - Notes & CTA */}
            <motion.div 
              className="space-y-6 text-white w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <p>{t('circle.notes.note1')}</p>
              <p>{t('circle.notes.note2')}</p>
              <p>{t('circle.notes.note3')}</p>
              <p>{t('circle.notes.note4')}</p>
              <p>{t('circle.notes.note5')}</p>
              <p>{t('circle.notes.note6')}</p>
              
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

export default Circle;
