import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import BlenderBottle from '../components/BlenderBottle';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';

// 3D-компонент бутылки
const Bottle3D = ({ scrollProgress }) => {
  return (
    <BlenderBottle 
      modelPath="/bottle-outi.glb" 
      scrollProgress={scrollProgress}
    />
  );
};

// Главная 3D-сцена с профессиональным освещением
const Scene = ({ scrollProgress }) => {
  return (
    <>
      {/* Мягкое основное освещение */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Основной ключевой свет */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.8} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Заполняющий свет слева */}
      {/* <directionalLight 
        position={[-8, 8, 5]} 
        intensity={0.6} 
        color="#f8f9fa"
      /> */}
      
      {/* Контровой свет сзади */}
      <directionalLight 
        position={[2, 5, -8]} 
        intensity={0.8} 
        color="#fff3e0"
      />
      
      {/* Дополнительные точечные источники для объема */}
      <pointLight position={[5, 10, 8]} intensity={0.5} color="#ffffff" distance={30} />
      <pointLight position={[-5, -5, 8]} intensity={0.3} color="#e3f2fd" distance={25} />
      
      {/* Мягкий свет снизу для подсветки теней */}
      <hemisphereLight 
        skyColor="#ffffff" 
        groundColor="#f5f5f5" 
        intensity={0.3}
      />
      
      <Bottle3D scrollProgress={scrollProgress} />
    </>
  );
};

// Первая секция: Hero
const HeroSection = () => {
  return (
      <section className="relative h-screen bg-black overflow-hidden flex flex-col justify-center items-center">
          {/* Заголовок в центре */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
              >
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-black text-yellow-200 leading-none tracking-tight text-center px-4"
                      style={{
                          textShadow: '2px 2px 0px rgba(0, 0, 0, 1), 4px 4px 0px rgba(255, 255, 255, 1)'
                      }}>
                      STEPPE<br />COFFEE
                  </h1>
              </motion.div>
          </div>

          {/* Подзаголовок в левом нижнем углу */}
          <motion.div
              className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-10 max-w-xs md:max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
          >
              <p className="text-sm md:text-base lg:text-lg text-white/80 leading-relaxed">
                  Полный цикл создания бренда:<br />
                  от маркетинговой стратегии до технической реализации
              </p>
          </motion.div>

          {/* Печать в правом нижнем углу */}
          <motion.div
              className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
          >
              <img 
                  src="/img/projects/stamp.webp" 
                  alt="Stamp" 
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain opacity-80"
              />
          </motion.div>

          <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
          >
              <div className="flex flex-col items-center space-y-3">
                  {/* <span className="text-lg text-white/60 font-semibold">Прокрутите</span> */}
                  <motion.div
                      animate={{ y: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                  >
                      <ChevronDown className="w-8 h-8 text-white/80" />
                  </motion.div>
              </div>
          </motion.div>
      </section>
  );
};

// ContentSection
const ContentSection = () => {
  return (
      <section className="min-h-screen relative flex flex-col lg:flex-row">
          {/* Левая белая часть */}
          <div className="w-full lg:w-1/2 bg-white relative z-30 min-h-screen lg:min-h-full">
              <div className="h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
                  <motion.div 
                      className="w-full max-w-md lg:max-w-lg"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                  >
                      {/* Основная карточка с мягким дизайном */}
                      {/* <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100/50 relative"> */}
                          {/* Мягкий декоративный элемент */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-300 rounded-full opacity-20"></div>
                          
                          {/* Заголовок секции */}
                          <div className="mb-6 md:mb-8">
                              <div className="flex items-start gap-3 mb-4">
                                  <div className="flex-1">
                                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-3 font-montserrat">
                                          Позиционирование бренда
                                      </h2>
                                      <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal font-montserrat">
                                          Мы составили уникальное торговое предложение, где Steppe Coffee не просто кофейня, а 
                                          <span className="font-medium text-gray-700 bg-gray-50 px-1 py-0.5 rounded mx-1">"четвертое пространство"</span>, 
                                          где рождаются смыслы, собирается креатив, кофе и культура.
                                      </p>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Целевая аудитория */}
                              <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 font-montserrat">
                                  Целевая аудитория
                              </h3>
                              <p className="text-xs md:text-sm text-gray-500 mb-4 leading-relaxed font-normal font-montserrat">
                                  В ходе анализа целевой аудитории были выявлены основные сегменты потенциальных посетителей:
                              </p>
                              
                              {/* Список аудитории с мягким дизайном */}
                              <div className="space-y-3 flex-1">
                                  <div className="bg-gray-50/70 rounded-lg p-3 md:p-4 border-l-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                      <div className="flex items-start gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-xs md:text-sm text-gray-700 font-normal leading-relaxed font-montserrat">
                                              <span className="font-medium text-gray-800">Профессионалы</span> — ценящие удобное пространство для работы и встреч
                                          </p>
                                      </div>
                                  </div>
                                  
                                  <div className="bg-gray-50/70 rounded-lg p-3 md:p-4 border-l-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                      <div className="flex items-start gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-xs md:text-sm text-gray-700 font-normal leading-relaxed font-montserrat">
                                              <span className="font-medium text-gray-800">Творческая молодежь</span> — студенты, ищущие атмосферу для вдохновения
                                          </p>
                                      </div>
                                  </div>
                                  
                                  <div className="bg-gray-50/70 rounded-lg p-3 md:p-4 border-l-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                      <div className="flex items-start gap-2">
                                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-xs md:text-sm text-gray-700 font-normal leading-relaxed font-montserrat">
                                              <span className="font-medium text-gray-800">Городские жители</span> — рассматривающие кофейню как место качественного отдыха
                                          </p>
                                      </div>
                                  </div>
                              </div>
                        
                  </motion.div>
              </div>
          </div>

          {/* Правая желтая часть */}
          <div className="w-full lg:w-1/2 bg-yellow-300 relative z-30 min-h-screen lg:min-h-full">
              <div className="h-full flex items-start justify-center pt-8 sm:pt-12 md:pt-16 lg:pt-20 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
                  <motion.div
                      className="w-full max-w-md lg:max-w-lg"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                  >
                      {/* Основная карточка с мягким дизайном */}
                          {/* Мягкий декоративный элемент */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full opacity-30"></div>
                          
                          {/* Заголовок секции */}
                          <div className="mb-6 md:mb-8">
                              <div className="flex items-start gap-3 mb-4">
                                  <div className="flex-1">
                                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-3 font-montserrat">
                                          Конкурентный анализ
                                      </h2>
                                      <p className="text-sm md:text-base text-gray-800 leading-relaxed font-normal font-montserrat">
                                          Провели сравнительный анализ прямых и косвенных конкурентов для определения уникальной позиции.
                                      </p>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Блоки конкурентов */}
                          <div className="space-y-4 mb-6 md:mb-8">
                              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-3 md:p-4 border-l-2 border-gray-700 transition-all duration-200">
                                  <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base flex items-center gap-2 font-montserrat">
                                      <span className="w-1 h-1 bg-gray-700 rounded-full flex-shrink-0"></span>
                                      Прямые конкуренты
                                  </h4>
                                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal pl-3 font-montserrat">
                                      локальные кофейни с авторским кофе и уютной атмосферой
                                  </p>
                              </div>
                              
                              <div className="bg-black/5 hover:bg-black/8 rounded-lg p-3 md:p-4 border-l-2 border-gray-700 transition-all duration-200">
                                  <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base flex items-center gap-2 font-montserrat">
                                      <span className="w-1 h-1 bg-gray-700 rounded-full flex-shrink-0"></span>
                                      Косвенные конкуренты
                                  </h4>
                                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal pl-3 font-montserrat">
                                      сетевые кофейни, рестораны с кофейным меню, коворкинги
                                  </p>
                              </div>
                          </div>

                          {/* Tone of Voice секция */}
                              <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 font-montserrat">
                                  Tone of Voice
                              </h3>
                              <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-normal mb-4 font-montserrat">
                                  Для бренда Steppe Coffee разработан tone of voice, отражающий ценности и характер заведения:
                              </p>
                              
                              <div className="space-y-3">
                                  <div className="bg-black/5 hover:bg-black/8 rounded-lg p-3 transition-all duration-200">
                                      <h5 className="font-medium text-gray-900 mb-1 text-xs md:text-sm font-montserrat">
                                          Дружелюбный и вдохновляющий
                                      </h5>
                                      <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                                          создает ощущение открытости и поддержки
                                      </p>
                                  </div>
                                  
                                  <div className="bg-black/5 hover:bg-black/8 rounded-lg p-3 transition-all duration-200">
                                      <h5 className="font-medium text-gray-900 mb-1 text-xs md:text-sm font-montserrat">
                                          Современный, но с локальными акцентами
                                      </h5>
                                      <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                                          сохраняет близость к культуре и идентичности города
                                      </p>
                                  </div>
                                  
                                  <div className="bg-black/5 hover:bg-black/8 rounded-lg p-3 transition-all duration-200">
                                      <h5 className="font-medium text-gray-900 mb-1 text-xs md:text-sm font-montserrat">
                                          Неформальный, живой стиль
                                      </h5>
                                      <p className="text-xs text-gray-700 leading-relaxed font-montserrat">
                                          помогает общаться с аудиторией на одном языке
                                      </p>
                                  </div>
                              </div>
                          
                  </motion.div>
              </div>
          </div>
      </section>
  );
};

// Маркетинговая секция
const MarketingSection = () => {
  return (
    <section className="bg-white relative flex flex-col md:flex-row" style={{ minHeight: '100vh' }}>
      {/* Заголовок по центру с улучшенной видимостью */}
      <div className="absolute top-6 md:top-8 lg:top-12 left-1/2 transform -translate-x-1/2 z-50">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 leading-none text-center px-5"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          // style={{
          //   textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.6)'
          // }}
        >
          МАРКЕТИНГ
        </motion.h2>
      </div>
      
      {/* Левая часть - Социальные сети */}
      <div className="w-full md:w-1/2 relative z-40 min-h-screen md:min-h-full" style={{ backgroundColor: '#E8C5A0' }}>
        {/* Защитный фоновый слой */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/95 to-orange-300/95 backdrop-blur-sm"></div>
        
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-between h-full">
          {/* Текст сверху */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-12 md:pt-16 lg:pt-20"
          >
            <div className="p-4 md:p-6 lg:p-8в">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                Социальные сети
              </h3>
              
              <div className="space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <p className="font-medium text-gray-900 mb-2 md:mb-3">
                    Разработали контент-план для:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-gray-800">
                    <span className="bg-white/40 px-2 py-1 rounded-lg text-center text-xs md:text-sm font-medium">Instagram</span>
                    <span className="bg-white/40 px-2 py-1 rounded-lg text-center text-xs md:text-sm font-medium">TikTok</span>
                    <span className="bg-white/40 px-2 py-1 rounded-lg text-center text-xs md:text-sm font-medium">LinkedIn</span>
                    <span className="bg-white/40 px-2 py-1 rounded-lg text-center text-xs md:text-sm font-medium">Threads</span>
                  </div>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <p className="text-gray-900">
                    Настроили профили и проводим съемки для социальных сетей
                  </p>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
                  <p className="text-gray-900">
                    Еженедельно отслеживаем статистику и улучшаем форматы
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Изображение внизу левой части */}
          <motion.div
            className="flex justify-center mt-6 md:mt-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"> */}
              <img 
                src="/img/projects/activity.webp" 
                alt="Активности Steppe Coffee" 
                className="w-50 md:w-66 lg:w-82 xl:w-98 h-auto"
              />
            {/* </div> */}
          </motion.div>
        </div>
      </div>

      {/* Правая часть - Offline активности */}
      <div className="w-full md:w-1/2 bg-gray-100 relative z-40 min-h-screen md:min-h-full">
        {/* Защитный фоновый слой */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-100/95 to-gray-200/95 backdrop-blur-sm"></div> */}
        
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-between h-full">
          {/* Изображение сверху правой части */}
          <motion.div
            className="flex justify-center pt-12 md:pt-16 lg:pt-20 mb-6 md:mb-8"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="/img/projects/social.webp" 
              alt="Социальные сети Steppe Coffee" 
              className="w-48 md:w-64 lg:w-80 xl:w-96 h-auto"
            />
          </motion.div>
          
          {/* Текст внизу */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border border-white/50 shadow-lg">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6" style={{ color: '#C17B3A' }}>
                Offline активности
              </h3>
              
              <div className="space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Принимаем партнерские предложения</p>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Устраиваем встречи с комьюнити</p>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/60 transition-all duration-300">
                  <p className="text-gray-800 font-medium">Разрабатываем мероприятия</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CasePage = () => {
  const containerRef = useRef(null);
  const seoData = useSEO('project');
  
  // Простая настройка прокрутки без дополнительных эффектов
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <>
      {seoData && <SEOHead {...seoData} />}
      <div ref={containerRef} className="relative w-full h-[500vh] bg-gray-100">{/* Удалил лишний пробел */}
        {/* 3D-сцена с улучшенными настройками */}
        <motion.div 
          className="fixed inset-0 z-20"
          style={{ opacity: 1 }}
        >
          <Canvas 
            camera={{ 
              position: [0, 0, 12], 
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            onCreated={({ gl, camera, scene }) => {
              gl.setClearColor(0x000000, 0);
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.0;
              camera.lookAt(0, 0, 0);
            }}
            style={{ pointerEvents: 'none' }}
            gl={{ 
              alpha: true, 
              antialias: window.devicePixelRatio <= 1,
              powerPreference: "high-performance",
              stencil: false,
              depth: true
            }}
            dpr={[1, 2]}
            frameloop="always" // Изменено для более плавной анимации
          >
            <Suspense fallback={null}>
              <Scene scrollProgress={scrollYProgress} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Контент-слои */}
        <div className="relative z-10 pointer-events-none">
          <HeroSection />
          <div className="pointer-events-auto">
              <ContentSection />
              <MarketingSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default CasePage;