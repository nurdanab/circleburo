import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; 
const CursorTrail = ({ children, isActive = true }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const lastPhotoTimeRef = useRef(0);
  const lastPhotoPositionRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const employeeImages = useMemo(() => [
    "/img/company/employee1.webp",
    "/img/company/employee2.webp",
    "/img/company/employee3.webp",
    "/img/company/employee4.webp",
    "/img/company/employee5.webp",
    "/img/company/employee6.webp",
    "/img/company/employee7.webp",
    "/img/company/employee8.webp",
    "/img/company/employee9.webp",
    "/img/company/employee10.webp",
    "/img/company/employee11.webp",
    "/img/company/employee12.webp",
    "/img/company/employee13.webp"
  ], []);

  // Запускаем показ фотографий после основной анимации
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Отслеживаем движение курсора
  useEffect(() => {
    let moveTimeout;
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      
      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        
        setCursor({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
        setIsMoving(true);
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => setIsMoving(false), 200);
      } else {
        setIsMoving(false);
        setPhotos([]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout);
    };
  }, []);

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Интервал для управления жизненным циклом фотографий
  useEffect(() => {
    if (!isAnimationComplete || !isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      setPhotos(prev => {
        const updated = prev.map(photo => {
          const age = now - photo.createdAt;
          
          if (age <= 100 && photo.phase === 'created') {
            return { ...photo, phase: 'appearing', scale: 1, opacity: 1 };
          }
          
          if (age >= 1000 && photo.phase === 'appearing') {
            return { ...photo, phase: 'disappearing', scale: 0.7, opacity: 0 };
          }
          
          return photo;
        });

        return updated.filter(photo => {
          const age = now - photo.createdAt;
          return age < 1500;
        });
      });
      
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimationComplete, isActive]);

  // Создание новой фотографии при движении курсора
  useEffect(() => {
    if (!isAnimationComplete || !isMoving || !isActive) return;

    const now = Date.now();
    const minInterval = 200;
    const minDistance = 50;

    if (now - lastPhotoTimeRef.current < minInterval) return;

    const distance = getDistance(
      cursor.x, cursor.y, 
      lastPhotoPositionRef.current.x, lastPhotoPositionRef.current.y
    );
    if (distance < minDistance) return;

    const id = Date.now() + Math.random();
    const randomImage = employeeImages[Math.floor(Math.random() * employeeImages.length)];
    const randomSize = 100 + Math.random() * 170;
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;

    const newPhoto = { 
      id, 
      src: randomImage, 
      x: cursor.x + offsetX, 
      y: cursor.y + offsetY, 
      size: randomSize, 
      scale: 0,
      opacity: 0,
      rotation: (Math.random() - 0.5) * 30,
      createdAt: now,
      phase: 'created'
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    lastPhotoTimeRef.current = now;
    lastPhotoPositionRef.current = { x: cursor.x, y: cursor.y };
  }, [isAnimationComplete, cursor.x, cursor.y, isMoving, isActive, employeeImages]);

  return (
    <div ref={sectionRef} className="relative">
      {isAnimationComplete && isActive && photos.length > 0 &&
        photos.map((photo) => (
          <div
            key={photo.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: photo.x,
              top: photo.y,
              width: `${photo.size}px`,
              height: `${photo.size}px`,
              transform: `translate(-50%, -50%) scale(${photo.scale}) rotate(${photo.rotation}deg)`,
              opacity: photo.opacity,
              zIndex: 1,
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity, transform',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `url(${photo.src}) center/cover`,
                mixBlendMode: 'screen',
              }}
            />
          </div>
        ))}

      {children}
    </div>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const [showCenterImage, setShowCenterImage] = useState(false);
  const [hideEmployeePhotos, setHideEmployeePhotos] = useState(false);
  const [hideCenterImage] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsAnimationStarted(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowCenterImage(true);
    }, 6000);

    // Скрываем фотографии сотрудников после завершения анимации
    const timer3 = setTimeout(() => {
      setHideEmployeePhotos(true);
    }, 6200);

    // Больше не скрываем центральное изображение
    // const timer4 = setTimeout(() => {
    //   setHideCenterImage(true);
    // }, 7500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      // clearTimeout(timer4);
    };
  }, []);

  // Сотрудники
  const employees = Array.from({ length: 13 }, (_, index) => {
    const side = Math.floor(Math.random() * 4);
    let initialX, initialY;

    switch(side) {
      case 0: initialX = -400 + Math.random() * 1000; initialY = -600 - Math.random() * 800; break;
      case 1: initialX = 800 + Math.random() * 600; initialY = -200 + Math.random() * 800; break;
      case 2: initialX = -400 + Math.random() * 1000; initialY = 600 + Math.random() * 800; break;
      case 3: initialX = -600 - Math.random() * 400; initialY = -200 + Math.random() * 800; break;
      default: initialX = Math.random() * 800 - 400; initialY = -1200;
    }

    const angle = (index * 360) / 13;
    const radius = 150 + Math.random() * 75;
    const finalX = Math.cos((angle * Math.PI) / 180) * radius;
    const finalY = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      id: index,
      initialX,
      initialY,
      finalX,
      finalY,
      initialSize: 170 + Math.random() * 120,   // маленькие на старте
      finalSize: 30 + Math.random() * 30,     // крупные в круге
      delay: 0,
      duration: 3.5 + Math.random() * 2.5,
      opacity: 1,
      imageIndex: index % 13,
    };
  });

  const employeeImages = useMemo(() => [
    "/img/company/employee1.webp",
    "/img/company/employee2.webp",
    "/img/company/employee3.webp",
    "/img/company/employee4.webp",
    "/img/company/employee5.webp",
    "/img/company/employee6.webp",
    "/img/company/employee7.webp",
    "/img/company/employee8.webp",
    "/img/company/employee9.webp",
    "/img/company/employee10.webp",
    "/img/company/employee11.webp",
    "/img/company/employee12.webp",
    "/img/company/employee13.webp"
  ], []);

  return (
    <>
      <CursorTrail isActive={true}>
        <div className="bg-black text-white relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px 800px' }}>
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
            <div className="relative w-full max-w-6xl h-[700px] flex items-center justify-center">
              
              

              {!hideEmployeePhotos && employees.map((employee) => {
                if (import.meta.env.DEV) {
                  console.log('🟢 Rendering employee photo:', employee.id, 'hideEmployeePhotos:', hideEmployeePhotos);
                }
                const isAnimating = isAnimationStarted;
                return (
                  <div
                    key={employee.id}
                    className="absolute z-20"
                    style={{
                      '--initial-x': `${employee.initialX}px`,
                      '--initial-y': `${employee.initialY}px`,
                      '--final-x': `${employee.finalX}px`,
                      '--final-y': `${employee.finalY}px`,
                      '--initial-size': `${employee.initialSize}px`,
                      '--final-size': `${employee.finalSize}px`,
                      '--duration': `${employee.duration}s`,
                      '--delay': `${employee.delay}s`,
                      '--opacity': `${employee.opacity}`,
                      opacity: isAnimating ? 1 : 0, 
                      animation: isAnimating
                        ? `photo-animation var(--duration) ease-in-out var(--delay) forwards`
                        : 'none',
                      display: hideEmployeePhotos ? 'none' : 'block',
                      visibility: hideEmployeePhotos ? 'hidden' : 'visible',
                    }}
                  >
                    <div
                      className="relative w-full h-full rounded-full overflow-hidden border border-white/20"
                      style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}
                    >
                      <img
                        src={employeeImages[employee.imageIndex]}
                        alt={`Team member ${employee.id + 1}`}
                        className="w-full h-full object-cover transition-all duration-300"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        width={Math.round(employee.finalSize)}
                        height={Math.round(employee.finalSize)}
                      />
                    </div>
                  </div>
                );
              })}

                {showCenterImage && !hideCenterImage && (
                 <div
                   className="absolute z-20 w-[600px] h-[600px] rounded-full overflow-hidden"
                style={{
                  opacity: hideCenterImage ? 0 : 1,
                  animation: hideCenterImage ? 'fadeOut 0.5s ease-out forwards' : 'fadeIn 1.5s ease-out',
                  transition: 'opacity 0.5s ease-out'
                }} >

                 <img
                    src="/img/circle-center.png"
                    alt="Circle Center"
                    className="w-full h-full object-cover"
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    />
                 </div>
            )}
              <div
                className="relative z-30 text-center opacity-0"
                style={{ animation: 'fadeIn 2s ease-out 5s forwards', pointerEvents: 'auto' }}
              >
                <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight tracking-wider">
                  <div className="text-white mb-3">{t('aboutPage.subtitle')}</div>
                  <div className="text-white mb-3">{t('aboutPage.subtitlebtn')}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </CursorTrail>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes photo-animation {
          0% {
            transform: translate(var(--initial-x), var(--initial-y)) translate(-50%, -50%);
            width: var(--initial-size);
            height: var(--initial-size);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          60% {
            transform: translate(var(--final-x), var(--final-y)) translate(-50%, -50%);
            width: var(--final-size);
            height: var(--final-size);
            opacity: var(--opacity);
          }
          80% {
            transform: translate(var(--final-x), var(--final-y)) translate(-50%, -50%);
            width: var(--final-size);
            height: var(--final-size);
            opacity: 0;
          }
          100% {
            transform: translate(var(--final-x), var(--final-y)) translate(-50%, -50%);
            width: 0;
            height: 0;
            opacity: 0;
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default AboutSection;
