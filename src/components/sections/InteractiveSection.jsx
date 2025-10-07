import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollToElement } from '../../utils/navigation';

const questions = [
  {
    id: 1,
    text: "quiz.questions.1",
    options: [
      { textKey: "quiz.options.yes", next: 2 },
      { textKey: "quiz.options.no", next: 3 },
    ],
  },
  {
    id: 2,
    text: "quiz.questions.2",
    options: [
      { textKey: "quiz.options.yes", next: 4 },
      { textKey: "quiz.options.no", next: 5 },
    ],
  },
  {
    id: 3,
    text: "quiz.questions.3",
    options: [
      { textKey: "quiz.options.yes", next: 2 },
      { textKey: "quiz.options.no", next: 5 },
    ],
  },
  {
    id: 4,
    text: "quiz.questions.4",
    options: [
      { textKey: "quiz.options.yes", result: "Cycle" },
      { textKey: "quiz.options.no", result: "Semi Circle" },
    ],
  },
  {
    id: 5,
    text: "quiz.questions.5",
    options: [
      { textKey: "quiz.options.yes", result: "Semi Circle" },
      { textKey: "quiz.options.no", result: "Circle" },
    ],
  },
];

const StartLogo = () => (
  <motion.div className="w-24 h-24 mx-auto mb-8 relative">
    <motion.img
      src="/img/circle-logo.png"
      alt="Circle Logo"
      className="w-full h-full object-contain filter drop-shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </motion.div>
);

const SemiCircleLogo = () => (
  <motion.div className="relative w-32 h-32 mx-auto mb-8">
    <motion.img
      src="/img/semi-quiz.png"
      alt="Semi Circle"
      className="w-full h-full object-contain filter drop-shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  </motion.div>
);

const CircleLogo = () => (
  <motion.div className="relative w-32 h-32 mx-auto mb-8">
    <motion.img
      src="/img/cycle-quiz.png"
      alt="Circle"
      className="w-full h-full object-contain filter drop-shadow-lg"
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: 1, rotate: 360 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  </motion.div>
);

const CycleLogo = () => (
  <motion.div className="relative w-32 h-32 mx-auto mb-8">
    <motion.img
      src="/img/circle-quiz.png"
      alt="Cycle"
      className="w-full h-full object-contain filter drop-shadow-lg"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

const serviceDetailKeys = {
  "Semi Circle": {
    subtitle: "quiz.results.semi_circle.subtitle",
    description: "quiz.results.semi_circle.description",
    component: SemiCircleLogo
  },
  "Circle": {
    subtitle: "quiz.results.circle.subtitle", 
    description: "quiz.results.circle.description",
    component: CircleLogo
  },
  "Cycle": {
    subtitle: "quiz.results.cycle.subtitle",
    description: "quiz.results.cycle.description",
    component: CycleLogo
  }
};

const InteractiveSection = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = questions.find((q) => q.id === step);

  const handleAnswer = (option) => {
    if (option.next) {
      setStep(option.next);
    } else if (option.result) {
      setResult(option.result);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setResult(null);
    setIsStarted(false);
  };

  const handleStart = () => {
    setIsStarted(true);
  };


  return (
    <section id="quiz" className="quiz-section bg-black text-white py-20 px-4 relative overflow-hidden min-h-screen flex items-center">

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          className="quiz-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t("quiz.headline")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-20 text-center"
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t("quiz.subheadline")}
        </motion.p>

        {/* Карточка с вопросами */}
        <div className="quiz-content relative min-h-[400px] mt-8">
          {!isStarted ? (
            // Стартовый экран
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm"
            >
              <StartLogo />
              <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              {t("quiz.start_screen.title")}
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
              {t("quiz.start_screen.description")}
              </p>
              <motion.button
                onClick={handleStart}
                className="group relative px-10 py-5 bg-gradient-to-r from-white to-gray-100 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 overflow-hidden btn-dark-theme"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                {t("quiz.start_screen.button")}
                  <motion.svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </motion.svg>
                </span>
              </motion.button>
            </motion.div>
          ) : !result ? (
            // Вопросы
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm"
              >
                {/* Прогресс бар */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{t("quiz.progress.question", { step })}</span>
                    <span>{Math.round((step / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-white to-gray-300 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(step / questions.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold mb-8 leading-tight text-center">
                  {t(currentQuestion.text)}
                </h3>
                
                <div className="flex flex-col gap-4 max-w-lg mx-auto">
                  {currentQuestion.options.map((option, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className="group relative px-8 py-5 bg-gradient-to-r from-white/8 to-white/4 hover:from-white/15 hover:to-white/10 border border-white/15 hover:border-white/30 rounded-2xl transition-all duration-300 text-lg text-left overflow-hidden shadow-lg hover:shadow-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center justify-between">
                        {t(option.textKey)}
                        <motion.svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        >
                          <path d="M7 17L17 7" />
                          <path d="M7 7h10v10" />
                        </motion.svg>
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            // Результат
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-12 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-sm"
            >
              {/* Анимированный логотип */}
              {React.createElement(serviceDetailKeys[result].component)}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm uppercase tracking-widest text-white/80 backdrop-blur-sm mb-4">
                  {t(serviceDetailKeys[result].subtitle)}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  {t("quiz.result_screen.title", { result })}
                </h3>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {t(serviceDetailKeys[result].description)}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    onClick={() =>
                      scrollToElement("contact", {
                        maxAttempts: 15,
                        delay: 150,
                        offset: 80,
                        behavior: 'smooth'
                      })
                    }
                    className="group relative px-10 py-5 bg-gradient-to-r from-white to-gray-100 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 overflow-hidden btn-dark-theme"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t("quiz.result_screen.button_start")}
                      <motion.svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </motion.svg>
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleRestart}
                    className="px-8 py-5 bg-gradient-to-r from-white/8 to-white/4 hover:from-white/15 hover:to-white/10 border border-white/15 hover:border-white/30 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("quiz.result_screen.button_restart")}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;