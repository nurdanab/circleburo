import React, { useEffect, useRef, useMemo } from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaTiktok, FaThreads } from 'react-icons/fa6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const { t } = useTranslation();
  const footerRef = useRef(null);
  const logoSectionRef = useRef(null);
  const socialRef = useRef(null);
  const contactSectionRef = useRef(null);
  const bottomSectionRef = useRef(null);

  // Мемоизация контактной информации с переводами
  const contactInfo = useMemo(() => [
    {
      icon: Phone,
      text: t('footer.phone1'),
      href: 'tel:+77761536092',
      ariaLabel: t('footer.phone1')
    },
    {
      icon: Phone,
      text: t('footer.phone2'),
      href: 'tel:+77754201840',
      ariaLabel: t('footer.phone2')
    },
    {
      icon: MapPin,
      text: t('footer.address'),
      href: 'https://2gis.kz/almaty/firm/70000001104431525',
      ariaLabel: t('footer.address')
    },
    {
      icon: Mail,
      text: t('footer.email'),
      href: 'mailto:info@circleburo.kz',
      ariaLabel: t('footer.email')
    },
  ], [t]);

  // Мемоизация социальных сетей с переводами
  const socialLinks = useMemo(() => [
    {
      icon: FaTiktok,
      href: 'https://www.tiktok.com/@madebycircle?_t=ZM-8zT1mZUDsS0&_r=1',
      label: t('footer.social.tiktok')
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/circlemadeit/',
      label: t('footer.social.instagram')
    },
    {
      icon: FaThreads,
      href: 'https://www.threads.com/@circlemadeit',
      label: t('footer.social.threads')
    },
  ], [t]);

  // Оптимизированные анимации
  useEffect(() => {
    const ctx = gsap.context(() => {
      const fadeInUp = {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      };

      // Анимация логотипа и описания
      if (logoSectionRef.current) {
        gsap.from(logoSectionRef.current.children, {
          ...fadeInUp,
          stagger: 0.2,
          scrollTrigger: {
            trigger: logoSectionRef.current,
            start: 'top 85%',
            once: true,
          }
        });
      }

      // Анимация социальных сетей
      if (socialRef.current) {
        gsap.from(socialRef.current.children, {
          opacity: 0,
          scale: 0.5,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: socialRef.current,
            start: 'top 85%',
            once: true,
          }
        });
      }

      // Анимация контактов
      if (contactSectionRef.current) {
        const heading = contactSectionRef.current.querySelector('h4');
        const items = contactSectionRef.current.querySelectorAll('li');

        if (heading) {
          gsap.from(heading, {
            ...fadeInUp,
            scrollTrigger: {
              trigger: contactSectionRef.current,
              start: 'top 85%',
              once: true,
            }
          });
        }

        gsap.from(items, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contactSectionRef.current,
            start: 'top 85%',
            once: true,
          }
        });
      }

      // Анимация нижней секции
      if (bottomSectionRef.current) {
        gsap.from(bottomSectionRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: bottomSectionRef.current,
            start: 'top 90%',
            once: true,
          }
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#F0CD4B] text-[#0E5A4D]"
      aria-label="Footer"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Верхняя секция */}
        <div className="pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16 border-b border-[#0E5A4D]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-20">

            {/* Логотип и описание */}
            <div className="lg:col-span-1">
              <div ref={logoSectionRef} className="mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-3 sm:mb-4 md:mb-5 text-[#0E5A4D] leading-tight">
                  CIRCLE
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#0E5A4D]/90">
                  {t('footer.description')}
                </p>
              </div>

              {/* Социальные сети */}
              <div ref={socialRef} className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[#0E5A4D]/8 border border-[#0E5A4D]/15 hover:bg-[#0E5A4D]/15 hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0E5A4D]/30"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0E5A4D]/70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Контакты */}
            <div className="md:col-span-1 lg:col-span-2">
              <div ref={contactSectionRef}>
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold mb-5 sm:mb-6 md:mb-8 text-[#0E5A4D]">
                  {t('footer.contact')}
                </h4>
                <ul className="space-y-4 sm:space-y-5 md:space-y-6">
                  {contactInfo.map((contact, index) => (
                    <li key={index}>
                      <a
                        href={contact.href}
                        target={contact.icon === MapPin ? "_blank" : undefined}
                        rel={contact.icon === MapPin ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3 sm:gap-3 md:gap-4 text-sm sm:text-base md:text-lg lg:text-xl text-[#0E5A4D]/70 hover:text-[#0E5A4D] hover:translate-x-2 transition-all duration-300 group focus:outline-none focus:text-[#0E5A4D]"
                        aria-label={contact.ariaLabel}
                      >
                        <contact.icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform duration-300" />
                        <span className="break-words">{contact.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя секция */}
        <div
          ref={bottomSectionRef}
          className="py-6 sm:py-8 md:py-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-[#0E5A4D]/60"
        >
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm md:text-base">{t('footer.copyright')}</p>
          </div>
          <div>
            <a
              href="/privacy-policy-circle.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm md:text-base text-[#0E5A4D]/70 hover:text-[#0E5A4D] hover:-translate-y-1 inline-block transition-all duration-300 focus:outline-none focus:text-[#0E5A4D]"
            >
              {t('footer.privacyPolicy')}
            </a>
          </div>
        </div>
      </div>

      {/* Декоративный градиент */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0E5A4D]/20 to-transparent" aria-hidden="true" />
    </footer>
  );
};

export default FooterSection;
