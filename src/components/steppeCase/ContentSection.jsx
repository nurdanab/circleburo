import React from 'react';
import { motion } from 'framer-motion';

const ContentSection = () => {
    return (
        <section className="min-h-screen relative flex">
            {/* Левая белая часть */}
            <div className="w-1/2 bg-white p-12 lg:p-16 xl:p-20 flex items-start justify-start pt-20">
                <motion.div 
                    className="max-w-lg"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-8">
                        Мы составили уникальное торговое предложение, где Steppe Coffee не просто кофейня, а "четвертое пространство", где рождаются смыслы, собирается креатив, кофе и культура.
                    </p>
                    
                    <div className="space-y-8">
                        <div>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                В ходе анализа целевой аудитории были выявлены основные сегменты потенциальных посетителей:
                            </p>
                            <ul className="space-y-3 text-sm text-gray-800">
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Ценящие удобное пространство для работы и встреч.
                                </li>
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Студенты и творческая молодежь, ищущие атмосферу для вдохновения и общения.
                                </li>
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Городские жители среднего возраста, рассматривающие кофейню как место отдыха от суеты города и качественного кофе.
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Правая желтая часть */}
            <div className="w-1/2 bg-yellow-300 p-12 lg:p-16 xl:p-20 flex items-start justify-start pt-20">
                <motion.div
                    className="max-w-lg"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-bold text-black mb-6">
                        Проведем сравнительный анализ прямых и косвенных конкурентов.
                    </h3>
                    
                    <div className="space-y-6 text-sm">
                        <div>
                            <p className="font-medium text-black mb-2">• Прямые конкуренты:</p>
                            <p className="text-gray-800 leading-relaxed">локальные кофейни с авторским кофе и атмосферой.</p>
                        </div>
                        
                        <div>
                            <p className="font-medium text-black mb-2">• Косвенные конкуренты:</p>
                            <p className="text-gray-800 leading-relaxed">сетевые кофейни, рестораны с кофейным меню, коворкинги.</p>
                        </div>
                    </div>

                    <div className="mt-12 space-y-6 text-sm">
                        <p className="text-black leading-relaxed">
                            Для бренда Steppe Coffee разработан tone of voice, отражающий ценности и характер заведения:
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-black mb-1">• Дружелюбный и вдохновляющий –</p>
                                <p className="text-gray-800 text-xs">создает ощущение открытости и поддержки.</p>
                            </div>
                            
                            <div>
                                <p className="font-medium text-black mb-1">• Современный, но с локальными акцентами –</p>
                                <p className="text-gray-800 text-xs">сохраняет близость к культуре и идентичности города.</p>
                            </div>
                            
                            <div>
                                <p className="font-medium text-black mb-1">• Неформальный, живой стиль –</p>
                                <p className="text-gray-800 text-xs">помогает общаться с аудиторией на одном языке.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContentSection;