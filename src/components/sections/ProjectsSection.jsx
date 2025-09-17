import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProjectsSection = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  
  const projectsData = [
    { 
      id: 1, 
      media: '/img/projects/case1.webp',  
      mediaType: 'image',  
      title: t('projects.before'), 
      link: '/project' 
    },
    { 
      id: 2, 
      media: '/img/projects/case2.mp4',  
      mediaType: 'video',  
      title: t('projects.process'), 
      link: '/project' 
    },
    { 
      id: 3, 
      media: '/img/projects/3case.webp',  
      mediaType: 'image', 
      title: t('projects.after'), 
      link: '/project' 
    },
  ];
  const totalCards = projectsData.length;

  const sectionHeight = `${totalCards * 100}vh`;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(totalCards - 1) * 100}vw`]
  );

  return (
    <section id="projects"
      ref={scrollRef}
      style={{ height: sectionHeight }}
      className="relative bg-black text-white"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Заголовок */}
        <motion.div
          className="relative z-20 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm uppercase tracking-widest text-white/80 backdrop-blur-sm mb-4">
            {t('projects.subtitle')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-white">
              {t('projects.title')}
            </span>
          </h1>
        </motion.div>

        {/* Горизонтальный список карточек */}
        <motion.div
          className="flex h-[70vh] gap-10 px-10"
          style={{ x, width: `${totalCards * 100}vw` }}
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              className="group relative w-[80vw] h-full rounded-[30px] overflow-hidden flex-shrink-0"
              initial={{ opacity: 0.5, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <Link to={project.link} className="absolute inset-0 z-20">
              {project.mediaType === 'video' ? (
                <video
                  src={project.media}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              ) : (
                <img
                  src={project.media} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-transparent group-hover:bg-black/50 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col justify-end p-8 w-full h-full">
                <h3 className="text-2xl md:text-3xl font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.title}
                </h3>
              </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;