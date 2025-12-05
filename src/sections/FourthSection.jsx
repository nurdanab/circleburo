import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { getMediaUrl } from '../utils/media';

gsap.registerPlugin(ScrollTrigger);

const FourthSection = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mediaItems = [
    { type: 'video', src: getMediaUrl("cover/cover2.mp4") },
    { type: 'video', src: getMediaUrl("cover/cover7.mp4") },
    { type: 'video', src: getMediaUrl("cover/cover5.mp4") },
    { type: 'image', src: getMediaUrl("cover/cover8.png") },
    { type: 'video', src: getMediaUrl("cover/cover1.mp4") },
    { type: 'image', src: getMediaUrl("cover/cover4.png") },
    { type: 'video', src: getMediaUrl("cover/cover6.mp4") },
    { type: 'video', src: getMediaUrl("cover/cover3.mp4") },
  ];

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Создаем изолированный контекст для безопасного cleanup
    const ctx = gsap.context(() => {
      // Анимация фонового текста с parallax эффектом
      gsap.to(".fourth-bg-text", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    // Cleanup только своих анимаций, не трогая другие секции
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{ backgroundColor: "#F6EDCE" }}
    >
      {/* Большой повторяющийся фоновый текст "CIRCLE MADE IT" */}
      <div
        className="fourth-bg-text absolute pointer-events-none select-none"
        style={{
          fontSize: 'clamp(60px, 8vw, 120px)',
          fontFamily: 'Lilita One, sans-serif',
          color: '#F09FB2',
          lineHeight: 1.3,
          top: '0',
          left: '-10%',
          width: '120%',
          height: '100%',
          opacity: 0.3,
        }}
      >
        {Array.from({ length: isMobile ? 20 : 40 }).map((_, rowIndex) => (
          <div key={rowIndex} style={{ whiteSpace: 'nowrap', marginBottom: '0.5rem' }}>
            {Array.from({ length: isMobile ? 5 : 10 }).map((_, colIndex) => (
              <span key={colIndex} className="inline-block px-4">
                CIRCLE MADE IT
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-gray-200 group cursor-pointer w-full"
              style={{ maxHeight: '600px', height: 'auto' }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="h-full w-full max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  loading="lazy"
                  style={{ display: 'block' }}
                />
              ) : (
                <img
                  src={item.src}
                  alt={`Cover ${index + 1}`}
                  className="h-full w-full max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  style={{ display: 'block' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourthSection;
