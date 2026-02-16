"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import styles from "./InterierSlider.module.scss";

const SLIDES = [
  { id: 1, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 1" },
  { id: 2, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 2" },
  { id: 3, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 3" },
  { id: 4, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 4" },
  { id: 5, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 5" },
  { id: 6, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 6" },
  { id: 7, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 7" },
  { id: 8, src: "/show-cases/interier/block-1.png", alt: "Интерьер — слайд 8" },
];

export default function InterierSlider() {
  const [current, setCurrent] = useState(0);

  const goPrev = useCallback(() => {
    setCurrent((i) => (i === 0 ? SLIDES.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrent((i) => (i === SLIDES.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <section className={styles.slider}>
      <div className={styles.sliderContainer}>
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.left}`}
          onClick={goPrev}
          aria-label="Предыдущий слайд"
        >
          <Image
            src="/show-cases/interier/left.svg"
            alt=""
            width={21}
            height={43}
            className={styles.arrowIcon}
          />
        </button>

        <div className={styles.slideWrapper}>
          <div
            className={styles.slideTrack}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide) => (
              <div key={slide.id} className={styles.slideItem}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1024px) 1440px, 100vw"
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>

          <div className={styles.dots}>
            {Array.from({ length: 8 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.dot} ${
                  index === current ? styles.activeDot : ""
                }`}
                aria-label={`Слайд ${index + 1}`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.arrowButton} ${styles.right}`}
          onClick={goNext}
          aria-label="Следующий слайд"
        >
          <Image
            src="/show-cases/interier/right.svg"
            alt=""
            width={21}
            height={43}
            className={styles.arrowIcon}
          />
        </button>
      </div>
    </section>
  );
}
