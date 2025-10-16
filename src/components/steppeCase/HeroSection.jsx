import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
                    <h1 className="text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem] font-black text-yellow-200 leading-none tracking-tight text-center"
                        style={{
                            textShadow: '4px 4px 0px rgba(0, 0, 0, 1), 8px 8px 0px rgba(255, 255, 255, 1)'
                        }}>
                        STEPPE<br />COFFEE
                    </h1>
                </motion.div>
            </div>

            {/* Подзаголовок в левом нижнем углу */}
            <motion.div
                className="absolute bottom-12 left-12 z-10 max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <p className="text-base md:text-lg text-white leading-relaxed">
                    Полный цикл создания бренда:<br />
                    от маркетинговой стратегии до технической реализации
                </p>
            </motion.div>

            {/* Печать в правом нижнем углу */}
            <motion.div
                className="absolute bottom-12 right-12 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <img 
                    src="/img/projects/stamp.webp" 
                    alt="Stamp" 
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain opacity-80"
                />
            </motion.div>

            <motion.div
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                {/* Комментарий */}
            </motion.div>
        </section>
    );
};

export default HeroSection;