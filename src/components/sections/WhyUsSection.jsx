import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Diamond, Rocket, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

// Компонент для отдельной карточки с scroll stack эффектом
const StackCard = ({ reason, index, totalCards }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Расчет когда карточка должна "прилипнуть" к стеку
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.85, 1, 1, 0.95 - index * 0.05]
  );

  // Y позиция: карточка поднимается, а затем фиксируется в стеке
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [60, 0, 0, -20]
  );

  return (
    <motion.div
      ref={cardRef}
      className="sticky"
      style={{
        scale,
        y,
        top: `${4 + index * 0.8}rem`, // Позиция в стеке
        zIndex: totalCards - index, // Порядок наложения
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="bg-stone-900 p-8 rounded-2xl border border-white hover:border-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="text-white mb-6 flex justify-center">
          {reason.icon}
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">
          {reason.title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-center">
          {reason.description}
        </p>
      </div>
    </motion.div>
  );
};

const WhyUsSection = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null); 

  const reasons = [
    {
      icon: <Diamond className="text-white w-10 h-10" />,
      title: t('whyUs.reasons.qualityFirst.title'),
      description: t('whyUs.reasons.qualityFirst.description'),
    },
    {
      icon: <Rocket className="text-white w-10 h-10" />,
      title: t('whyUs.reasons.creativeSolutions.title'),
      description: t('whyUs.reasons.creativeSolutions.description'),
    },
    {
      icon: <Lightbulb className="text-white w-10 h-10" />,
      title: t('whyUs.reasons.innovation.title'),
      description: t('whyUs.reasons.innovation.description'),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-black text-white relative py-20 px-4 md:px-8"
      aria-labelledby="why-us-heading"
      role="region"
    >
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 id="why-us-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('whyUs.title')}
          </h2>
        </motion.div>

        {/* Контейнер для stacking карточек */}
        <div className="max-w-2xl mx-auto space-y-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="h-[40vh] flex items-center justify-center"
            >
              <StackCard reason={reason} index={index} totalCards={reasons.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;