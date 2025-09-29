import React, { useEffect, useRef, useState } from 'react';
import { Diamond, Rocket, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

// Компонент для отдельной карточки с scroll stack эффектом
const StackCard = ({ reason, index, totalCards, fm }) => {
  const cardRef = useRef(null);

  if (fm && fm.motion && fm.useScroll && fm.useTransform) {
    const { scrollYProgress } = fm.useScroll({
      target: cardRef,
      offset: ["start end", "end start"]
    });

    const scale = fm.useTransform(
      scrollYProgress,
      [0, 0.3, 0.7, 1],
      [0.85, 1, 1, 0.95 - index * 0.05]
    );

    const y = fm.useTransform(
      scrollYProgress,
      [0, 0.3, 0.7, 1],
      [60, 0, 0, -20]
    );

    const MotionDiv = fm.motion.div;

    return (
      <MotionDiv
        ref={cardRef}
        className="sticky"
        style={{
          scale,
          y,
          top: `${4 + index * 0.8}rem`,
          zIndex: totalCards - index,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <div className="bg-stone-900 p-8 rounded-2xl border border-white hover:border-white/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
      </MotionDiv>
    );
  }

  // Fallback без фреймера: статичная карточка с лёгкими CSS-анимациями
  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{
        top: `${4 + index * 0.8}rem`,
        zIndex: totalCards - index,
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      <div className="bg-stone-900 p-8 rounded-2xl border border-white/60 hover:border-white/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
    </div>
  );
};

const WhyUsSection = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null); 
  const [fm, setFm] = useState(null);

  useEffect(() => {
    // Лениво подгружаем framer-motion, когда секция приближается
    const loadFm = () => {
      import('framer-motion').then((mod) => {
        setFm({ motion: mod.motion, useScroll: mod.useScroll, useTransform: mod.useTransform });
      }).catch(() => setFm(null));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadFm();
          observer.disconnect();
        }
      });
    }, { rootMargin: '400px' });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadFm);
      } else {
        setTimeout(loadFm, 0);
      }
    }

    return () => observer.disconnect();
  }, []);

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
        {fm && fm.motion ? (
        <fm.motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 id="why-us-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('whyUs.title')}
          </h2>
        </fm.motion.div>
        ) : (
        <div className="text-center mb-16" style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <h2 id="why-us-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t('whyUs.title')}
          </h2>
        </div>
        )}

        {/* Контейнер для stacking карточек */}
        <div className="max-w-2xl mx-auto space-y-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="h-[40vh] flex items-center justify-center"
            >
              <StackCard reason={reason} index={index} totalCards={reasons.length} fm={fm} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;