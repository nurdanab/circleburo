import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, Rocket, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

const WhyUsSection = () => {
  const { t } = useTranslation(); 

  const reasons = [
    {
      icon: <Diamond className="text-4xl w-10 h-10" />,
      title: t('whyUs.reasons.qualityFirst.title'),
      description: t('whyUs.reasons.qualityFirst.description'),
    },
    {
      icon: <Rocket className="text-4xl w-10 h-10" />,
      title: t('whyUs.reasons.creativeSolutions.title'),
      description: t('whyUs.reasons.creativeSolutions.description'),
    },
    {
      icon: <Lightbulb className="text-4xl w-10 h-10" />,
      title: t('whyUs.reasons.innovation.title'),
      description: t('whyUs.reasons.innovation.description'),
    },
  ];

  return (
    <section
      className="bg-black text-white relative py-20 px-4 md:px-8"
      aria-labelledby="why-us-heading"
      role="region"
    >
      <div className="max-w-6xl mx-auto relative">
        
        {/* Заголовок */}
        <motion.div 
          className="text-center sticky top-20 z-10 bg-black py-4 mb-8 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 id="why-us-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('whyUs.title')}
          </h2>
        </motion.div>

        {/* Контейнер для карточек */}
        <div className="relative min-h-[150vh] flex flex-col gap-8 items-center justify-center">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="w-full md:w-[60%] lg:w-[45%] p-1 rounded-[30px]"
                style={{
                  position: 'sticky',
                  top: `calc(30% + ${index * 30}px)`,
                  zIndex: index + 1,
                  background: 'linear-gradient(225deg, #dbdbdb, #e6e6e6)',
                }}
                initial={{ opacity: 0.7, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.8 }}
              >
                <div className="bg-[#1a1a1a] p-8 rounded-[30px] flex flex-col items-center text-center w-full h-full">
                  <div className="text-gray-700 mb-4">
                    {reason.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;