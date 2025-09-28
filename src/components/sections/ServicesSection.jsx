import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StructuredData from '../StructuredData';

const ServicesSection = () => {
  const { t } = useTranslation();

  const servicesData = [
    {
      id: 1,
      title: t('services.semicircle.title'),
      subtitle: t('services.semicircle.subtitle'),
      description: t('services.semicircle.description'),
      bgImage: 'img/semi-decor.png',
      hoverBgImage: 'img/semi-decor-hover.png',
      link: '/semicircle',
    },
    {
      id: 2,
      title: t('services.circle.title'),
      subtitle: t('services.circle.subtitle'),
      description: t('services.circle.description'),
      bgImage: 'img/circle-decor.png',
      hoverBgImage: 'img/circle-decor-hover.png',
      link: '/circle',
    },
    {
      id: 3,
      title: t('services.cycle.title'),
      subtitle: t('services.cycle.subtitle'),
      description: t('services.cycle.description'),
      bgImage: 'img/cycle-decor.png',
      hoverBgImage: 'img/cycle-decor-hover.png',
      link: '/cycle',
    },
  ];

  return (
    <section id="services" className="bg-black text-white py-20 px-4">
      {/* Structured Data for services */}
      {servicesData.map((service) => (
        <StructuredData 
          key={service.id}
          type="service" 
          data={service} 
        />
      ))}
      
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-0"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t('services.title')}
        </motion.h1>

        {/* Контейнер для карточек */}
        <div className="flex flex-col lg:flex-row gap-12 justify-center items-center" style={{ marginTop: '40px' }}>
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textColorClass = isHovered ? 'text-black' : 'text-white';

  return (
    <motion.div
      className="relative w-full max-w-sm h-96 rounded-[30px] overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={service.link} onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="block w-full h-full">
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-all duration-75 ease-in-out"
          style={{ backgroundImage: `url(${isHovered ? service.hoverBgImage : service.bgImage})` }}
        />
        <div className={`relative z-10 p-8 h-full flex flex-col justify-between transition-colors duration-75 ${textColorClass}`}>
          <div>
            <span className="text-sm tracking-widest uppercase opacity-70">{service.subtitle}</span>
            <h3 className="text-3xl md:text-4xl font-bold mt-2">{service.title}</h3>
          </div>
          <div>
            <p className="text-lg mb-4">{service.description}</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServicesSection;