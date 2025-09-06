// src/pages/CasePage.jsx
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, Palette, Code, Target, Users, TrendingUp, Figma, Camera, Package, Globe, Smartphone, Zap, ArrowRight } from 'lucide-react';
import OverviewCards from '../components/OverviewCards';

const CasePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeSection, setActiveSection] = useState('overview');
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  const mainSections = [
    {
      id: 'overview',
      title: "Обзор проекта",
      icon: Coffee,
      color: "bg-yellow-400"
    },
    {
      id: 'marketing',
      title: "Маркетинг",
      icon: Target,
      color: "bg-yellow-400"
    },
    {
      id: 'design',
      title: "Дизайн",
      icon: Palette,
      color: "bg-yellow-400"
    },
    {
      id: 'development',
      title: "Разработка",
      icon: Code,
      color: "bg-yellow-400"
    }
  ];

  const overviewCardsData = [
    {
      title: "Анализ целевой аудитории",
      points: [
        "Ценящие удобное пространство для работы и встреч.",
        "Студенты и творческая молодежь, ищущие атмосферу для вдохновения и общения.",
        "Городские жители среднего возраста, рассматривающие кофейню как комфортное место для отдыха и качественного кофе."
      ],
      description: "Каждый сегмент характеризуется особыми ожиданиями: одни ориентированы на функциональность и удобство, другие — на атмосферность и возможность для самовыражения."
    },
    {
      title: "Анализ конкурентов",
      points: [
        "Прямые конкуренты: локальные кофейни с авторским кофе и атмосферой.",
        "Косвенные конкуренты: сетевые кофейни, рестораны с кофейным меню, коворкинги."
      ],
      description: "Это позволило выявить зоны, где Steppe Coffee может занять нишу: создание уникальной идентичности, объединение кофе с культурными и креативными практиками."
    },
    {
      title: "Бренд-платформа",
      points: [
        "Дружелюбный и вдохновляющий – создаёт ощущение открытости и поддержки.",
        "Современный, но с локальными акцентами – сохраняет близость к культуре и идентичности города.",
        "Неформальный, живой стиль – помогает общаться с аудиторией на одном языке."
      ],
      description: "В качестве визуального и коммуникационного элемента создан маскот – сайгак, символ, воплощающий атмосферу Steppe Coffee. Он отражает степную природу, оригинальность и лёгкость бренда и усиливает узнаваемость бренда."
    }
  ];

  const marketingRoadmap = [
    {
      title: "Социальные сети",
      description: "1. Разработали контент-план для:",
      icon: Users,
      image1: "/img/projects/inst.webp",
      image2: "/img/projects/linkedin.webp",
      image3: "/img/projects/threads.webp",
      image4: "/img/projects/tiktok.webp",
      details: ["Instagram", "TikTok", "LinkedIn", "Threads"],
      description2: "2. Настроили профили и проводим съемки для социальных сетей",
      description3: "3. Еженедельно отслеживаем статистику и улучшаем форматы"
    },
    {
      title: "Offline активности",
      icon: TrendingUp,
      image1: "/img/projects/1poster.webp",
      image2: "/img/projects/2poster.webp",
      image3: "/img/projects/3poster.webp",
      details: ["Принимаем партнерские предложения", "Устраиваем встречи с комьюнити", "Разрабатываем мероприятия"],
      description: ""
    }
  ];

  const designRoadmap = [
    {
      title: "Гайдбук",
      description: "Наша команда дизайнеров разработала:",
      icon: Coffee,
      image: "/img/logo-design.jpg",
      details: ["Персонаж-маскот", "Фирменные цвета", "Логотип", "Паттерны", "Шрифты" ]
    },
    {
      title: "Мануал для барист",
      description: "Для улучшения работы внутри кофейни был создан документ для обучения новых сотрудников (внутренняя обертка-обучение)",
      icon: Palette,
      image: "/img/color-palette.jpg"
        },
    {
      title: "Меню",
      description: "Придерживаясь единого стиля, было создано новое оформление меню",
      icon: Figma,
      image: "/img/typography.jpg"
        },
    {
      title: "Рекламный материал",
      description: "Мы также разработали рекламные баннеры, лайтбоксы и брошюры",
      icon: Camera,
      image: "/img/photo-style.jpg"
        },
    {
      title: "Оформление в кофейне",
      description: "Для поддержания уюта наша команда создала печатную продукцию для нашего клиента:",
      icon: Package,
      image: "/img/packaging.jpg",
      details: ["Этикетки", "Флаеры", "Оформление стаканчиков", "Мокап"]
    },
    {
      title: "Униформа",
      description: "Также были разработана униформа для барист",
      icon: Target,
      image: "/img/merchandise.jpg"
    }
  ];

  const developmentRoadmap = [
    {
      title: "Веб-сайт",
      description: "Разработка современного сайта с онлайн-заказом и доставкой",
      icon: Globe,
      image: "/img/website.jpg",
      details: ["Responsive дизайн", "Система заказов", "CMS интеграция"]
    },
    {
      title: "Мобильное приложение",
      description: "Создание удобного приложения для постоянных клиентов",
      icon: Smartphone,
      image: "/img/mobile-app.jpg",
      details: ["iOS & Android", "Программа лояльности", "Push-уведомления"]
    },
    {
      title: "Интеграции",
      description: "Подключение систем оплаты, CRM и аналитики",
      icon: Zap,
      image: "/img/integrations.jpg",
      details: ["Платежные системы", "CRM система", "Аналитика"]
    }
  ];

  const getCurrentRoadmap = () => {
    switch(activeSection) {
      case 'marketing': return marketingRoadmap;
      case 'design': return designRoadmap;
      case 'development': return developmentRoadmap;
      default: return [];
    }
  };
  
  const OverviewSection = ({ cardsData }) => (
    <div className="relative flex flex-col items-center">
      {/* Container for the blobs. Note: for true 'blob' shapes, you'd use a custom SVG background */}
      <div className="absolute inset-0 bg-yellow-400 rounded-[10rem] rotate-2 -z-10" />

      <div className="grid md:grid-cols-2 gap-8 items-start mb-16 px-8 py-16">
        {/* Left column: Text blob */}
        <div className="relative bg-white rounded-3xl p-8 border border-gray-800 shadow-xl shadow-gray-950/50">
          <p className="text-black text-xl font-bold leading-relaxed">
            {cardsData[2].description}
          </p>
        </div>

        {/* Right column: Mascot image */}
        <div className="flex justify-center md:justify-start">
          <img 
            src="/img/projects/saygak-5.webp" 
            alt="Mascot" 
            className="w-4/5 md:w-full h-auto" 
          />
        </div>
      </div>

      {/* Second part of the overview section: Analysis blocks */}
      <div className="relative grid md:grid-cols-2 gap-8 items-start max-w-7xl mx-auto mt-16 px-8">
        {/* Left block: Audience Analysis */}
        <motion.div
          className="bg-yellow-400 rounded-2xl p-8 shadow-md"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-black mb-4">
            {cardsData[0].title}
          </h3>
          <ul className="list-none space-y-3 mb-6">
            {cardsData[0].points.map((point, index) => (
              <li key={index} className="flex items-start text-black">
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-3 mt-2" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-black text-sm leading-relaxed">
            {cardsData[0].description}
          </p>
        </motion.div>

        {/* Right block: Competitor Analysis */}
        <motion.div
          className="bg-yellow-400 rounded-2xl p-8 shadow-md"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-black mb-4">
            {cardsData[1].title}
          </h3>
          <ul className="list-none space-y-3 mb-6">
            {cardsData[1].points.map((point, index) => (
              <li key={index} className="flex items-start text-black">
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-3 mt-2" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-black text-sm leading-relaxed">
            {cardsData[1].description}
          </p>
        </motion.div>
      </div>
    </div>
  );

  const ImageGallery = ({ item, isLeft }) => {
    const images = Object.keys(item)
      .filter(key => key.startsWith('image') && item[key])
      .map(key => item[key]);
  
    return (
      <motion.div
        className={`w-5/12 ${isLeft ? 'pl-16' : 'pr-16'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {images.map((imageSrc, idx) => (
            <motion.div
              key={idx}
              className="relative overflow-hidden rounded-2xl aspect-square"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
              }}
            >
              <img
                src={imageSrc}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };
  
  const TimelineSection = ({ items, isEven = false }) => {
    return (
      <div className="relative">
        {/* Simple vertical line instead of the SVG gradient */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-800 z-0" />
  
        <div className="relative z-10 space-y-24">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;
            const hasMultipleImages = Object.keys(item).some(key => key.startsWith('image') && key !== 'image');
  
            return (
              <motion.div
                key={index}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} relative`}
                initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Content Card */}
                <div className={`w-5/12 ${isLeft ? 'pr-16' : 'pl-16'}`}>
                  <motion.div 
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-8 group hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {item.description}
                      </p>
                    )}
                    
                    {item.details && (
                      <div className="space-y-2 mb-6">
                        {item.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    )}
                    {item.description2 && (
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {item.description2}
                      </p>
                    )}
                    {item.description3 && (
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {item.description3}
                      </p>
                    )}
                  </motion.div>
                </div>
  
                {/* Center Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                  <motion.div 
                    className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg relative"
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Icon className="w-8 h-8 text-black" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                  </motion.div>
                </div>
  
                {/* Image or Image Gallery on the opposite side */}
                {hasMultipleImages ? (
                  <ImageGallery item={item} isLeft={isLeft} />
                ) : (
                  <div className={`w-5/12 ${isLeft ? 'pl-16' : 'pr-16'}`}>
                    <motion.div
                      className="aspect-video relative overflow-hidden rounded-2xl"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const RoadmapCard = ({ item, index, isOverview = false }) => {
    const Icon = item.icon;
    return (
      <motion.div
        key={index}
        className="group relative"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden h-full transition-all duration-500 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              <span className="text-sm">Изображение проекта</span>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
              {item.title}
            </h3>
            
            {isOverview && item.stats && (
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-semibold">{item.stats}</span>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400 transition-colors" />
              </div>
            )}
            
            {!isOverview && item.details && (
              <div className="space-y-2">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3" />
                    {detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="bg-black min-h-screen text-white overflow-hidden">
      {/* Note: The blob pattern would need to be a background image asset */}
      <motion.section 
        className="relative h-screen flex items-center justify-center"
        style={{ y: heroY }}
      >
        {/* Mascots with absolute positioning */}
        <motion.img 
          src="/img/projects/saygak-1.webp" 
          alt="Mascot" 
          className="absolute -top-16 left-16 w-48 h-auto"
          initial={{ y: -50, opacity: 0, rotate: -20 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.img 
          src="/img/projects/saygak-2.webp" 
          alt="Small Mascot"
          className="absolute top-16 right-16 w-24 h-auto"
          initial={{ x: 50, opacity: 0, rotate: 20 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-block px-6 py-2 bg-yellow-400 text-black font-bold rounded-full text-sm uppercase tracking-wider mb-6">
              Кейс-стади
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-white">КОФЕЙНЯ</span>
            <span className="block text-yellow-400">STEPPE COFFE</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Полный цикл создания бренда: от маркетинговой стратегии до технической реализации
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="animate-bounce"
          >
            <ChevronDown className="w-8 h-8 text-yellow-400 mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      <div className="relative min-h-screen">
        <div className="sticky top-0 z-50">
          <div className="flex justify-center py-6">
            <div className="relative bg-yellow-400 rounded-full shadow-xl shadow-gray-950/50 px-4 py-3 border-4 border-black">
              
              {/* Mascots with absolute positioning */}
              <motion.img 
                src="/img/projects/saygak-3.webp" 
                alt="Mascot"
                className="absolute -top-16 -left-16 w-32 h-auto" 
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: -15, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.img 
                src="/img/projects/saygak-4.webp" 
                alt="Small Mascot"
                className="absolute -top-16 right-0 w-24 h-auto"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />

              <div className="flex items-center space-x-2">
                {mainSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-3 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-black text-white'
                          : 'text-black'
                      }`}
                    >
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                    <span className="text-yellow-400">ОБЗОР</span> ПРОЕКТА
                  </h2>
                </div>
                
                <OverviewSection cardsData={overviewCardsData} />
              </motion.div>
            )}

            {activeSection !== 'overview' && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase">
                    {activeSection === 'marketing' && <span className="text-yellow-400">МАРКЕТИНГ</span>}
                    {activeSection === 'design' && <span className="text-yellow-400">ДИЗАЙН</span>}
                    {activeSection === 'development' && <span className="text-yellow-400">РАЗРАБОТКА</span>}
                  </h2>
                  <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    {activeSection === 'marketing' && "Стратегический анализ и позиционирование бренда"}
                    {activeSection === 'design' && "Создание визуальной идентичности и фирменного стиля"}
                    {activeSection === 'development' && "Техническая реализация и цифровые решения"}
                  </p>
                </div>
                
                <TimelineSection 
                  items={getCurrentRoadmap()} 
                  isEven={activeSection === 'design'} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CasePage;