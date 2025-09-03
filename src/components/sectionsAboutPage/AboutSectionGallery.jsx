import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 


const AboutSectionGallery = () => {
  const { t } = useTranslation();

  // Определяем все текстовые карточки
  const textCards = [
    { title: t('aboutUsGallery.placeholderCards.title1'), text: t('aboutUsGallery.placeholderCards.text1') },
    { title: t('aboutUsGallery.placeholderCards.title2'), text: t('aboutUsGallery.placeholderCards.text2') },
    { title: t('aboutUsGallery.placeholderCards.title3'), text: t('aboutUsGallery.placeholderCards.text3') },
    { title: t('aboutUsGallery.placeholderCards.title4'), text: t('aboutUsGallery.placeholderCards.text4') },
    { title: t('aboutUsGallery.placeholderCards.title21'), text: t('aboutUsGallery.placeholderCards.text21') },
    { title: t('aboutUsGallery.placeholderCards.title22'), text: t('aboutUsGallery.placeholderCards.text22') },
    { title: t('aboutUsGallery.placeholderCards.title31'), text: t('aboutUsGallery.placeholderCards.text31') },
    { title: t('aboutUsGallery.placeholderCards.title32'), text: t('aboutUsGallery.placeholderCards.text32') },
    { title: t('aboutUsGallery.placeholderCards.title33'), text: t('aboutUsGallery.placeholderCards.text33') },
    { title: t('aboutUsGallery.placeholderCards.title34'), text: t('aboutUsGallery.placeholderCards.text34') },
  ];

  // Массив путей к изображениям
  const imagePaths = [
    '/img/companyGallery/gallery-1.webp',
    '/img/companyGallery/gallery-2.webp',
    '/img/companyGallery/gallery-3.webp',
    '/img/companyGallery/gallery-4.webp',
    '/img/companyGallery/gallery-5.webp',
    '/img/companyGallery/gallery-6.webp',
    '/img/companyGallery/gallery-7.webp',
    '/img/companyGallery/gallery-8.webp',
    '/img/companyGallery/gallery-9.webp',
    '/img/companyGallery/gallery-10.webp',
    '/img/companyGallery/gallery-11.webp',
    '/img/companyGallery/gallery-12.webp',
    '/img/companyGallery/gallery-13.jpeg',
    '/img/companyGallery/gallery-14.webp',
    '/img/companyGallery/gallery-15.webp',
    '/img/companyGallery/gallery-16.webp',
    '/img/companyGallery/gallery-17.webp',
    '/img/companyGallery/gallery-18.webp',
    '/img/companyGallery/gallery-19.webp',
    '/img/companyGallery/gallery-21.webp',
    '/img/companyGallery/gallery-22.jpeg',
    '/img/companyGallery/gallery-23.webp',
    '/img/companyGallery/gallery-24.webp',
    '/img/companyGallery/gallery-25.webp',
    '/img/companyGallery/gallery-26.webp',
    '/img/companyGallery/gallery-27.webp',
  ];

  // Колонка 1 - с указанием размеров 3-small, 6-medium, 1-large, 2-largee
  const column1 = [
    { type: 'text', content: textCards[0], size: 'medium' },
    { type: 'image', src: imagePaths[13], size: 'large' }, // gallery-14.webp
    { type: 'image', src: imagePaths[11], size: 'medium' }, // gallery-12.webp
    { type: 'text', content: textCards[1], size: 'small' },
    { type: 'image', src: imagePaths[19], size: 'largee' }, // gallery-21.webp
    { type: 'image', src: imagePaths[0], size: 'medium' },  // gallery-1.webp
    { type: 'image', src: imagePaths[9], size: 'medium' },  // gallery-10.webp
    { type: 'image', src: imagePaths[16], size: 'small' }, // gallery-17.webp
    { type: 'text', content: textCards[2], size: 'medium' },
    { type: 'image', src: imagePaths[22], size: 'largee' }, // gallery-24.webp
    { type: 'image', src: imagePaths[1], size: 'medium' },  // gallery-2.webp
    { type: 'text', content: textCards[3], size: 'small' },
  ];

  // Колонка 2
  const column2 = [
    { type: 'image', src: imagePaths[6], size: 'large' },  // gallery-7.webp
    { type: 'image', src: imagePaths[18], size: 'small' }, // gallery-19.webp
    { type: 'text', content: textCards[4], size: 'medium' },
    { type: 'image', src: imagePaths[7], size: 'medium' },  // gallery-8.webp
    { type: 'image', src: imagePaths[20], size: 'medium' }, // gallery-22.jpeg
    { type: 'image', src: imagePaths[24], size: 'small' }, // gallery-26.webp
    { type: 'text', content: textCards[5], size: 'medium' },
    { type: 'image', src: imagePaths[8], size: 'medium' },  // gallery-9.webp
    { type: 'image', src: imagePaths[5], size: 'largee' },  // gallery-6.webp
    { type: 'image', src: imagePaths[4], size: 'medium' },  // gallery-5.webp
    { type: 'image', src: imagePaths[25], size: 'largee' }, // gallery-27.webp
    { type: 'image', src: imagePaths[15], size: 'small' }, // gallery-16.webp
  ];

  // Колонка 3
  const column3 = [
    { type: 'image', src: imagePaths[21], size: 'largee' }, // gallery-23.webp
    { type: 'image', src: imagePaths[14], size: 'small' }, // gallery-15.webp
    { type: 'text', content: textCards[6], size: 'medium' },
    { type: 'image', src: imagePaths[17], size: 'largee' }, // gallery-18.webp
    { type: 'text', content: textCards[7], size: 'medium' },
    { type: 'image', src: imagePaths[2], size: 'medium' },  // gallery-3.webp
    { type: 'image', src: imagePaths[12], size: 'medium' }, // gallery-13.jpeg
    { type: 'image', src: imagePaths[23], size: 'medium' }, // gallery-25.webp
    { type: 'text', content: textCards[8], size: 'medium' },
    { type: 'image', src: imagePaths[3], size: 'small' },  // gallery-4.webp
    { type: 'text', content: textCards[9], size: 'small' },
    { type: 'image', src: imagePaths[10], size: 'large' }, // gallery-11.webp
  ];

  // Варианты анимации для Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Функция для получения классов высоты
  const getSizeClasses = (size, type) => {
    const sizeMap = {
      small: type === 'image' ? 'h-40' : 'min-h-[150px]',
      medium: type === 'image' ? 'h-60' : 'min-h-[230px]', 
      large: type === 'image' ? 'h-90' : 'min-h-[300px]',
      largee: type === 'image' ? 'h-120' : 'min-h-[370px]'
    };
    return sizeMap[size] || sizeMap.medium;
  };

  // Функция для рендера элемента (с контролем размеров)
  const renderItem = (item, index, columnIndex) => {
    const sizeClass = getSizeClasses(item.size, item.type);
    
    return (
      <div
        key={`${columnIndex}-${index}`}
        className="mb-4"
      >
        {item.type === 'image' ? (
          <div className={`rounded-2xl overflow-hidden shadow-lg ${sizeClass}`}>
            <img
              src={item.src}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ width: '100%', height: '100%' }}
              loading="lazy"
              onLoad={(e) => {
                console.log(`✅ Successfully loaded: ${item.src}`);
              }}
              onError={(e) => {
                console.error(`❌ Failed to load image: ${item.src}`);
                if (e.target.parentElement) {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-red-500 text-white rounded-2xl">
                      <div class="text-center p-4">
                        <div class="text-2xl mb-2">❌</div>
                        <p class="text-xs font-medium">Failed to load</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        ) : (
          <div className={`bg-neutral-900 p-6 rounded-2xl shadow-lg text-white ${sizeClass} flex flex-col justify-center border border-neutral-800`}>
            <h3 className="text-xl font-bold mb-4 text-white">{item.content.title}</h3>
            <p className="text-sm opacity-80 leading-relaxed text-gray-300">
              {item.content.text}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Колонка 1 */}
          <div className="flex flex-col space-y-4">
            {column1.map((item, index) => renderItem(item, index, 1))}
          </div>

          {/* Колонка 2 */}
          <div className="flex flex-col space-y-4">
            {column2.map((item, index) => renderItem(item, index, 2))}
          </div>

          {/* Колонка 3 */}
          <div className="flex flex-col space-y-4">
            {column3.map((item, index) => renderItem(item, index, 3))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionGallery;