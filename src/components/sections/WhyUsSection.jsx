import React from 'react';
import { SimpleMotion } from '../SimpleMotion';
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
        <SimpleMotion.FadeIn
          className="text-center sticky top-20 z-10 bg-black py-4 mb-8 md:mb-16"
          delay={0}
        >
          <h2 id="why-us-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('whyUs.title')}
          </h2>
        </SimpleMotion.FadeIn>

        {/* Контейнер для карточек */}
        <div className="relative space-y-8">
            {reasons.map((reason, index) => (
              <SimpleMotion.ScaleIn
                key={index}
                className="w-full md:w-[60%] lg:w-[45%] p-1 rounded-[30px] mx-auto"
                style={{
                  background: 'linear-gradient(225deg, #dbdbdb, #e6e6e6)',
                }}
                delay={index * 100}
                once={true}
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
              </SimpleMotion.ScaleIn>
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;