import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBreakpoint } from "../../utils/breakpoints";
import { getMediaUrl } from '../../utils/media';

gsap.registerPlugin(ScrollTrigger);

const VideoPinSection = () => {
  const sectionRef = useRef(null);
  const videoBoxRef = useRef(null);

  // Унифицированное определение размера экрана
  const { isMobile, isTablet } = useBreakpoint();

  useGSAP(() => {
    if (isMobile || !sectionRef.current || !videoBoxRef.current) return;

    // Создаем изолированный контекст для анимации
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "-15% top",
          end: isTablet ? "150% top" : "200% top",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(videoBoxRef.current, {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power1.inOut",
      });
    }, sectionRef);

    // Cleanup при размонтировании
    return () => ctx.revert();
  }, [isMobile, isTablet]);

  return (
    <section ref={sectionRef} className="vd-pin-section">
      <div
        ref={videoBoxRef}
        style={{
          clipPath: isMobile
            ? "circle(100% at 50% 50%)"
            : "circle(6% at 50% 50%)",
        }}
        className="size-full video-box"
      >
        <video
          src={getMediaUrl("videos/motion-circle.mp4")}
          playsInline
          muted
          loop
          autoPlay
          preload="none"
          aria-label="Демонстрационное видео Circle"
        />

        <div className="abs-center md:scale-100 scale-200">
          {/* Placeholder for future interactive elements */}
        </div>
      </div>
    </section>
  );
};

export default VideoPinSection;
