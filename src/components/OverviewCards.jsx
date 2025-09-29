// src/components/OverviewSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const OverviewSection = ({ cardsData }) => {
  return (
    <div className="relative py-16">
      {/* Background container that mimics the blob shape */}
      {/* Note: for the exact blob shape, you would use a custom SVG background image */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[90%] md:w-[70%] lg:w-[800px] h-full bg-yellow-400 rounded-full rotate-3 -z-10" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[85%] md:w-[68%] lg:w-[780px] h-full bg-yellow-400 rounded-full rotate-6 -z-20" />

      {/* Main content of the overview section */}
      <div className="relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-start mb-16 px-8">
          {/* Left column: Text blob */}
          <motion.div 
            className="relative bg-white rounded-3xl p-8 border border-gray-800 shadow-xl shadow-gray-950/50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <p className="text-black text-xl font-bold leading-relaxed">
              {cardsData[2].description}
            </p>
          </motion.div>

          {/* Right column: Mascot image */}
          <motion.div 
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <img 
              src="/img/projects/saygak-5.webp" 
              alt="Mascot" 
              className="w-4/5 md:w-full h-auto" 
              loading="lazy"
              decoding="async"
              fetchpriority="low"
            />
          </motion.div>
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
    </div>
  );
};

export default OverviewSection;