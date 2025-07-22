import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedTitle({ text = '' }) {
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const spans = titleEl.querySelectorAll('span');
    if (!spans.length) return;

    gsap.set(spans, {
      autoAlpha: 0,
      y: 30,
      filter: 'blur(6px)',
    });

    const animateIn = () => {
      gsap.to(spans, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.15,
        duration: 0.4,
        ease: 'power4.out',
      });
    };

    const animateOut = () => {
      gsap.to(spans, {
        autoAlpha: 0,
        y: 40,
        filter: 'blur(6px)',
        stagger: -0.15,
        duration: 0.4,
        ease: 'power2.in',
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: titleEl,
      start: 'top 75%',
      end: 'top 30%',
      onEnter: animateIn,
      onLeaveBack: animateOut,
    });

    const checkIfVisible = () => {
      const rect = titleEl.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) animateIn();
    };

    setTimeout(checkIfVisible, 100);

    window.addEventListener('hashchange', checkIfVisible);

    return () => {
      trigger.kill();
      window.removeEventListener('hashchange', checkIfVisible);
    };
  }, [text]);

  return (
    <h2 className="services-title" ref={titleRef}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block' }}>
          {word}&nbsp;
        </span>
      ))}
    </h2>
  );
}