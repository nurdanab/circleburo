import { useState, useEffect } from "react";
import { getMediaUrl } from '../utils/media';
import { useVideoLazyLoad } from '../hooks/useVideoLazyLoad';

const SectionFive = () => {
  const { videoRef } = useVideoLazyLoad({ threshold: 0.1, rootMargin: '100px' });
  const [isMobile, setIsMobile] = useState(false);

  // Одно видео
  const videoSrc = getMediaUrl("videos/prod1.mp4");

  // Проверка размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#000000",
        aspectRatio: isMobile ? '16/9' : undefined,
        maxHeight: isMobile ? '70vh' : undefined,
        height: isMobile ? 'auto' : '100vh',
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        playsInline
        muted
        loop
        preload="none"
      />
    </section>
  );
};

export default SectionFive;
