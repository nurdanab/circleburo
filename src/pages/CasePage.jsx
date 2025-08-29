// src/pages/CasePage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';

const CasePage = () => {
  // const seoData = useSEO('project'); // или 'circle', 'semicircle', 'cycle', 'project'

  // const [currentCard, setCurrentCard] = useState(0);

  // // Данные для анимированных карточек (упрощенные для начала)
  // const analysisCards = [
  //   {
  //     title: "Анализ целевой аудитории",
  //     content: [
  //       "Ценящие удобное пространство для работы и встреч.",
  //       "Студенты и творческая молодежь, ищущие атмосферу для вдохновения и общения.",
  //       "Городские жители среднего возраста, рассматривающие кофейню как комфортное место для отдыха."
  //     ],
  //     subtitle: "Каждый сегмент характеризуется особыми ожиданиями по функциональности и атмосфере."
  //   },
  //   {
  //     title: "Конкурентный анализ", 
  //     content: [
  //       "Прямые конкуренты: локальные кофейни с авторским кофе и атмосферой.",
  //       "Косвенные конкуренты: сетевые кофейни, рестораны с кофейным меню."
  //     ],
  //     subtitle: "Выявлены возможности для создания уникальной идентичности и позиционирования."
  //   },
  //   {
  //     title: "Tone of voice",
  //     content: [
  //       "Дружелюбный и вдохновляющий – создает ощущение открытости.",
  //       "Современный с локальными акцентами – близость к культуре города.",
  //       "Неформальный стиль – помогает общаться с аудиторией на одном языке."
  //     ],
  //     subtitle: "Создан маскот-сайгак как символ степей и оригинальности Казахстана."
  //   }
  // ];

  // // Автопролистывание
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentCard((prev) => (prev + 1) % analysisCards.length);
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

  // const nextCard = () => {
  //   setCurrentCard((prev) => (prev + 1) % analysisCards.length);
  // };

  // const prevCard = () => {
  //   setCurrentCard((prev) => (prev - 1 + analysisCards.length) % analysisCards.length);
  // };

  // return (
  //   <div className="min-h-screen bg-black text-white">
      
  //     {/* Hero Section - максимально близко к макету */}
  //     <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        
  //       {/* Главный заголовок */}
  //       <div className="text-center relative z-10">
  //         <motion.h1 
  //           className="text-7xl md:text-9xl font-black leading-tight"
  //           initial={{ opacity: 0, y: 100 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 1 }}
  //         >
  //           <div className="text-yellow-400">STEPPE</div>
  //           <div className="text-white mt-2">COFFEE</div>
  //         </motion.h1>
          
  //         {/* CASE лейбл */}
  //         <motion.div 
  //           className="inline-block bg-white text-black px-4 py-2 rounded-md mt-6 font-bold text-lg"
  //           initial={{ opacity: 0, scale: 0.8 }}
  //           animate={{ opacity: 1, scale: 1 }}
  //           transition={{ delay: 0.5, duration: 0.5 }}
  //         >
  //           CASE
  //         </motion.div>
  //       </div>

  //       {/* Описание */}
  //       <motion.div 
  //         className="absolute bottom-20 left-1/2 transform -translate-x-1/2 max-w-2xl text-center px-4"
  //         initial={{ opacity: 0, y: 50 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ delay: 0.8, duration: 0.8 }}
  //       >
  //         <p className="text-sm md:text-base text-gray-300 leading-relaxed">
  //           Мы составили уникальное торговое предложение, где Steppe Coffee не 
  //           просто кофейня, а "чекпоинт современности", где посетители смогут 
  //           совершить креативный кофе-культурный опыт.
  //         </p>
  //       </motion.div>

  //       {/* Маскот - заглушка (позже заменишь на изображение) */}
  //       <motion.div 
  //         className="absolute top-32 right-10 md:right-20"
  //         animate={{ 
  //           y: [0, -15, 0],
  //           rotate: [0, 5, -5, 0]
  //         }}
  //         transition={{ 
  //           duration: 3,
  //           repeat: Infinity,
  //           ease: "easeInOut"
  //         }}
  //       >
  //         <div className="w-20 h-20 md:w-28 md:h-28 bg-yellow-400 rounded-full flex items-center justify-center text-4xl md:text-5xl">
  //           🦌
  //         </div>
  //       </motion.div>

  //     </section>

  //     {/* Желтая полоса с MARKETING */}
  //     <section className="bg-yellow-400 py-6 overflow-hidden">
  //       <motion.div 
  //         className="flex whitespace-nowrap"
  //         animate={{ x: [-200, -2000] }}
  //         transition={{ 
  //           duration: 20,
  //           repeat: Infinity,
  //           ease: "linear"
  //         }}
  //       >
  //         {Array(20).fill(0).map((_, i) => (
  //           <span key={i} className="text-4xl md:text-6xl font-black text-black mr-8">
  //             MARKETING
  //           </span>
  //         ))}
  //       </motion.div>
  //     </section>

  //     {/* Секция MARKETING с карточками */}
  //     <section className="py-20 px-4">
  //       <div className="max-w-6xl mx-auto">
          
  //         <motion.h2 
  //           className="text-5xl md:text-7xl font-black text-center mb-16"
  //           initial={{ opacity: 0 }}
  //           whileInView={{ opacity: 1 }}
  //           viewport={{ once: true }}
  //         >
  //           MARKETING
  //         </motion.h2>

  //         {/* Карточки */}
  //         <div className="relative max-w-4xl mx-auto h-[400px] md:h-[500px]">
  //           <AnimatePresence mode="wait">
  //             <motion.div
  //               key={currentCard}
  //               initial={{ opacity: 0, x: 300, rotateY: 90 }}
  //               animate={{ opacity: 1, x: 0, rotateY: 0 }}
  //               exit={{ opacity: 0, x: -300, rotateY: -90 }}
  //               transition={{ duration: 0.5 }}
  //               className="absolute inset-0 bg-yellow-400 rounded-2xl p-6 md:p-8"
  //             >
  //               <div className="h-full flex flex-col justify-between text-black">
                  
  //                 <div>
  //                   <h3 className="text-xl md:text-2xl font-bold mb-6">
  //                     {analysisCards[currentCard].title}
  //                   </h3>
                    
  //                   <div className="space-y-4">
  //                     {analysisCards[currentCard].content.map((item, index) => (
  //                       <motion.div 
  //                         key={index}
  //                         className="flex items-start text-sm md:text-base"
  //                         initial={{ opacity: 0, y: 20 }}
  //                         animate={{ opacity: 1, y: 0 }}
  //                         transition={{ delay: index * 0.1 }}
  //                       >
  //                         <span className="mr-3 mt-1">•</span>
  //                         <span className="leading-relaxed">{item}</span>
  //                       </motion.div>
  //                     ))}
  //                   </div>
  //                 </div>
                  
  //                 <div className="border-t border-black/20 pt-4 mt-6">
  //                   <p className="text-sm leading-relaxed">
  //                     {analysisCards[currentCard].subtitle}
  //                   </p>
  //                 </div>
                  
  //               </div>
  //             </motion.div>
  //           </AnimatePresence>

  //           {/* Стрелки навигации */}
  //           <button 
  //             onClick={prevCard}
  //             className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
  //           >
  //             <span className="text-white text-lg">←</span>
  //           </button>
            
  //           <button 
  //             onClick={nextCard}
  //             className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
  //           >
  //             <span className="text-white text-lg">→</span>
  //           </button>
  //         </div>

  //         {/* Точки-индикаторы */}
  //         <div className="flex justify-center mt-8 space-x-2">
  //           {analysisCards.map((_, index) => (
  //             <button
  //               key={index}
  //               onClick={() => setCurrentCard(index)}
  //               className={`w-3 h-3 rounded-full transition-all ${
  //                 index === currentCard 
  //                   ? 'bg-yellow-400 scale-125' 
  //                   : 'bg-gray-600 hover:bg-gray-500'
  //               }`}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </section>

  //     {/* Секция с органическими формами - упрощенная версия */}
  //     <section className="py-20 px-4">
  //       <div className="max-w-6xl mx-auto space-y-20">
          
  //         {/* Блок социальных сетей */}
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
  //           <motion.div
  //             className="bg-yellow-400 rounded-3xl p-8 text-black"
  //             initial={{ opacity: 0, x: -100 }}
  //             whileInView={{ opacity: 1, x: 0 }}
  //             transition={{ duration: 0.8 }}
  //             viewport={{ once: true }}
  //           >
  //             <h3 className="text-2xl font-bold mb-4">СОЦИАЛЬНЫЕ СЕТИ</h3>
  //             <div className="space-y-2 text-base">
  //               <div>• Визуальный контент-план для Instagram</div>
  //               <div>• Stories</div>
  //               <div>• Reels</div>
  //               <div>• Facebook</div>
  //             </div>
  //             <p className="text-sm mt-4 pt-4 border-t border-black/20">
  //               Разработали комплексную стратегию контент-маркетинга с акцентом на визуальную составляющую бренда.
  //             </p>
  //           </motion.div>

  //           {/* Органическая форма - пока заглушка */}
  //           <motion.div
  //             className="relative h-80"
  //             initial={{ opacity: 0, x: 100 }}
  //             whileInView={{ opacity: 1, x: 0 }}
  //             transition={{ duration: 0.8 }}
  //             viewport={{ once: true }}
  //           >
  //             <div 
  //               className="bg-yellow-400 w-full h-full flex items-center justify-center rounded-3xl"
  //               style={{ 
  //                 clipPath: "polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)"
  //               }}
  //             >
  //               <div className="text-black text-center font-medium">
  //                 📱 Здесь будут<br/>скриншоты<br/>соцсетей
  //               </div>
  //             </div>
  //           </motion.div>

  //         </div>

  //         {/* Блок Offline активности */}
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
  //           {/* Органическая форма слева */}
  //           <motion.div
  //             className="relative h-80 order-2 lg:order-1"
  //             initial={{ opacity: 0, x: -100 }}
  //             whileInView={{ opacity: 1, x: 0 }}
  //             transition={{ duration: 0.8 }}
  //             viewport={{ once: true }}
  //           >
  //             <div 
  //               className="bg-yellow-400 w-full h-full flex items-center justify-center rounded-3xl"
  //               style={{ 
  //                 clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)"
  //               }}
  //             >
  //               <div className="text-black text-center font-medium">
  //                 📄 Здесь будут<br/>материалы<br/>offline
  //               </div>
  //             </div>
  //           </motion.div>

  //           <motion.div
  //             className="bg-yellow-400 rounded-3xl p-8 text-black order-1 lg:order-2"
  //             initial={{ opacity: 0, x: 100 }}
  //             whileInView={{ opacity: 1, x: 0 }}
  //             transition={{ duration: 0.8 }}
  //             viewport={{ once: true }}
  //           >
  //             <h3 className="text-2xl font-bold mb-4">Offline активности</h3>
  //             <div className="space-y-2 text-base">
  //               <div>• Полиграфия интерьерные и наружные материалы</div>
  //               <div>• Сувенирная продукция</div> 
  //               <div>• Разработка системы навигации</div>
  //             </div>
  //             <p className="text-sm mt-4 pt-4 border-t border-black/20">
  //               Комплексный подход к оформлению пространства и созданию фирменной продукции.
  //             </p>
  //           </motion.div>

  //         </div>

  //       </div>
  //     </section>

  //   </div>
  // );
};

export default CasePage;