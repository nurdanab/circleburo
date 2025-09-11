import "tailwindcss";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';

function NotFoundPage() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <>
      <SEOHead 
        title={t('notFound.title')}
        description={t('notFound.description')}
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 px-4 py-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center lg:text-left" variants={itemVariants}>
            <motion.div 
              className="text-8xl md:text-9xl font-black text-stone-600 bg-clip-text mb-4"
              variants={itemVariants}
            >
              404
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              {t('notFound.title')}
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-100 mb-8 max-w-md mx-auto lg:mx-0"
              variants={itemVariants}
            >
              {t('notFound.description')}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-stone-200 to-stone-300 text-black font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {t('notFound.goHome')}
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-stone-200 text-white font-semibold rounded-lg hover:bg-blue-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {t('notFound.aboutUs')}
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center relative"
            variants={itemVariants}
          >
            <div className="relative w-80 h-80">
              <motion.div
                className="absolute w-32 h-32 bg-gradient-to-r from-stone-500 to-stone-400 rounded-full opacity-70 top-0 right-0"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-20 h-20 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full opacity-70 bottom-10 left-10"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
              <motion.div
                className="absolute w-16 h-16 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full opacity-70 top-16 left-5"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default NotFoundPage;