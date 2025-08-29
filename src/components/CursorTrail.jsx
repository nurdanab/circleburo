import React, { useState, useEffect, useRef } from 'react';

const CursorTrail = ({ children, isActive = true }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isInSection, setIsInSection] = useState(false);
  const lastPhotoTimeRef = useRef(0);
  const lastPhotoPositionRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const employeeImages = [
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
  ];

  // Запускаем показ фотографий после основной анимации
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Отслеживаем, находится ли курсор в секции
  useEffect(() => {
    const checkIfInSection = (e) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInside = e.clientX >= rect.left && 
                      e.clientX <= rect.right && 
                      e.clientY >= rect.top && 
                      e.clientY <= rect.bottom;
      
      setIsInSection(isInside);
    };

    const handleMouseMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      checkIfInSection(e);
      
      setIsMoving(true);
      clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => setIsMoving(false), 200);
    };

    const moveTimeout = { current: null };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout.current);
    };
  }, []);

  // Очищаем фотографии при выходе из секции
  useEffect(() => {
    if (!isInSection) {
      setPhotos([]);
    }
  }, [isInSection]);

  // Проверяем расстояние между точками
  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Интервал для управления жизненным циклом фотографий
  useEffect(() => {
    if (!isAnimationComplete || !isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      setPhotos(prev => prev.map(photo => {
        const age = now - photo.createdAt;
        
        // Появление (первые 100ms)
        if (age <= 100 && photo.phase === 'created') {
          return { ...photo, phase: 'appearing', scale: 1, opacity: 0.9 };
        }
        
        // Начинаем исчезновение через 2.5 секунды
        if (age >= 1000 && photo.phase === 'appearing') {
          return { ...photo, phase: 'disappearing', scale: 0.7, opacity: 0 };
        }
        
        return photo;
      }));

      // Удаляем фотографии старше 3 секунд
      setPhotos(prev => prev.filter(photo => {
        const age = now - photo.createdAt;
        return age < 1500;
      }));
      
    }, 50); // проверяем каждые 50ms

    return () => clearInterval(interval);
  }, [isAnimationComplete, isActive]);

  // Создание новой фотографии при движении курсора
  useEffect(() => {
    if (!isAnimationComplete || !isMoving || !isInSection || !isActive) return;

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

    // Получаем позицию секции для корректного позиционирования
    const sectionRect = sectionRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    const newPhoto = { 
      id, 
      src: randomImage, 
      x: cursor.x - sectionRect.left + offsetX, 
      y: cursor.y - sectionRect.top + offsetY, 
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
  }, [isAnimationComplete, cursor.x, cursor.y, isMoving, isInSection, isActive]);

  return (
    <div ref={sectionRef} className="relative">
      {isAnimationComplete && isActive &&
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
              zIndex: -1,
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity, transform',
            }}
          >
            <img
              src={photo.src}
              alt="Employee"
              className="w-full h-full rounded-full object-cover"
              style={{
                mixBlendMode: 'screen',
                boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.1)',
              }}
              draggable={false}
            />
          </div>
        ))}

      {children}
    </div>
  );
};

export default CursorTrail;