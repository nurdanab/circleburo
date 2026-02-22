"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./InterierSlider.module.scss";

// Each slide has a unique image: block-1.png, block-2.png, etc.
const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: `/show-cases/interier/block-${i + 1}.png`,
}));

export default function InterierSlider() {
  const t = useTranslations("showCaseInterior");
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
          aria-label={t("prevSlide")}
        >
          <Image
            src={getMediaUrl("/show-cases/interier/left.svg")}
            alt=""
            width={21}
            height={43}
            className={styles.arrowIcon}
            unoptimized
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
                  src={getMediaUrl(slide.src)}
                  alt={t("slideAlt", { n: slide.id })}
                  fill
                  sizes="(min-width: 1024px) 1440px, 100vw"
                  quality={75}
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>

          <div className={styles.dots}>
            {SLIDES.map((_, index) => (
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
          aria-label={t("nextSlide")}
        >
          <Image
            src={getMediaUrl("/show-cases/interier/right.svg")}
            alt=""
            width={21}
            height={43}
            className={styles.arrowIcon}
            unoptimized
          />
        </button>
      </div>
    </section>
  );
}
