// src/components/OverviewCards.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

const OverviewCards = ({ cards }) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8 mb-16">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="group relative"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-full transition-all duration-500 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20">
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
              {card.title}
            </h3>
            
            <ul className="list-none space-y-3 mb-6">
              {card.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start text-gray-400">
                  <Dot className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="ml-2">{point}</span>
                </li>
              ))}
            </ul>
            
            <p className="text-gray-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;