import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTiktok, FaThreads } from 'react-icons/fa6';
import { navigateToSection } from '../utils/navigation'; 


const FooterSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для навигации к секциям (используем улучшенную утилиту)
  const scrollToSection = (sectionId) => {
    navigateToSection(navigate, location.pathname, '/', sectionId, {
      maxAttempts: 15,
      delay: 150,
      offset: 80 // Account for fixed header
    });
  };

  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  const navigationLinks = [
    { name: t('nav.home'), to: '/', isLink: true },
    { name: t('nav.about'), to: '/about', isLink: true },
    { name: t('nav.services'), sectionId: 'services', isLink: false },
    { name: t('nav.portfolio'), sectionId: 'projects', isLink: false },
    { name: t('nav.contact'), sectionId: 'contact', isLink: false },
  ];

  const services = [
    { name: 'Semicircle', to: '/semicircle' },
    { name: 'Circle', to: '/circle' },
    { name: 'Cycle', to: '/cycle' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+7 776 153 60 92', href: 'tel:+7 776 153 60 92' },
    { icon: Phone, text: '+7 775 420 18 40', href: 'tel:+7 775 420 18 40' },
    { icon: MapPin, text: '2/2 Khodzhanova Street Almaty, Kazakhstan', href: 'https://go.2gis.com/6P5z3' },
    { icon: Mail, text: 'info@circleburo.kz', href: 'mailto:info@circleburo.kz' },
  ];

  const socialLinks = [
    { icon: FaTiktok, href: 'https://www.tiktok.com/@madebycircle?_t=ZM-8zT1mZUDsS0&_r=1', label: 'TikTok' },
    { icon: Instagram, href: 'https://www.instagram.com/circlemade.it/', label: 'Instagram' },
    { icon: FaThreads, href: 'https://www.threads.com/@circlemade.it', label: 'Threads' },
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Анимированные звёздочки на фоне */}
      <motion.div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={`footer-star-${star.id}`}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.3)`,
            }}
            animate={{
              opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Фоновые градиенты */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-white/6 via-white/3 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-radial from-white/4 via-white/2 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Основной контент футера */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Верхняя секция */}
        <motion.div
          className="py-16 md:py-20 border-b border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Логотип и описание */}
            <div className="lg:col-span-1">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src="/img/circle-logo.png"
                  alt="Circle Logo"
                  className="w-16 h-16 object-contain filter drop-shadow-lg mb-6"
                />
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                    CIRCLE
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  {t('footer.description')}
                </p>
              </motion.div>

              {/* Социальные сети */}
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="group w-12 h-12 bg-gradient-to-r from-white/8 to-white/4 hover:from-white/15 hover:to-white/10 border border-white/15 hover:border-white/30 rounded-full flex items-center justify-center transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Навигация и услуги */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Навигация */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold mb-6 text-white">{t('footer.navigation')}</h4>
                <ul className="space-y-4">
                  {navigationLinks.map((link, index) => {
                    return (
                      <li key={index}>
                        {link.isLink ? (
                          <Link
                            to={link.to}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-gray-400 hover:text-white transition-colors duration-300 text-lg group flex items-center"
                          >
                            {link.name}
                            <motion.svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                            >
                              <path d="M7 17L17 7" />
                              <path d="M7 7h10v10" />
                            </motion.svg>
                          </Link>
                        ) : (
                          <button
                            onClick={() => scrollToSection(link.sectionId)}
                            className="text-gray-400 hover:text-white transition-colors duration-300 text-lg group flex items-center bg-transparent border-none cursor-pointer"
                          >
                            {link.name}
                            <motion.svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                            >
                              <path d="M7 17L17 7" />
                              <path d="M7 7h10v10" />
                            </motion.svg>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>

              {/* Услуги */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold mb-6 text-white">{t('footer.services')}</h4>
                <ul className="space-y-4">
                  {services.map((service, index) => (
                    <li key={index}>
                      <Link
                        to={service.to}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-lg group flex items-center"
                        // whileHover={{ x: 5 }}
                        // transition={{ duration: 0.2 }}
                      >
                        {service.name}
                        <motion.svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <path d="M7 17L17 7" />
                          <path d="M7 7h10v10" />
                        </motion.svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Контакты */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold mb-6 text-white">{t('footer.contact')}</h4>
                <ul className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <li key={index}>
                      <motion.a
                        href={contact.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-lg group flex items-center"
                        // whileHover={{ x: 5 }}
                        // transition={{ duration: 0.2 }}
                      >
                        <contact.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="break-all">{contact.text}</span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Нижняя секция */}
        <motion.div
          className="py-8 flex flex-col md:flex-row justify-between items-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>{t('footer.copyright')}</p>
          </div>
          <div className="flex space-x-6 text-sm">
  <motion.a
    href="/privacy-policy-circle.pdf"
    className="hover:text-white transition-colors duration-300"
    whileHover={{ y: -2 }}
  >
    {t('footer.privacyPolicy')}
  </motion.a>

</div>
        </motion.div>
      </div>

      {/* Декоративный градиент внизу */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </footer>
  );
};

export default FooterSection;