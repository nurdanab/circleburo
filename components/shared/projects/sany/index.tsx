"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./sany.module.scss";

const SLIDER_SLIDES = [
  { src: getMediaUrl("/projects-pages/sany/section2.jpg"), alt: "Sany — слайд 1" },
  { src: getMediaUrl("/projects-pages/sany/sany-section3.png"), alt: "Sany — слайд 2" },
  { src: getMediaUrl("/projects-pages/sany/sany-section3.png"), alt: "Sany — слайд 3" },
  { src: getMediaUrl("/projects-pages/sany/section4.png"), alt: "Sany — слайд 4" },
];

export default function SanyProject() {
  const t = useTranslations("projects");
  const [sliderIndex, setSliderIndex] = useState(0);

  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/sany/hero.png")}
            alt="Sany hero — Quality changes the world"
            fill
            sizes="100vw"
            quality={80}
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – текст слева, фото интерьера справа */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("sany.title")}</span>
            <p>{t("sany.description")}</p>
          </div>
          <div className={styles.section2ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/sany/section1.jpg")}
              alt="Sany интерьер"
              width={620}
              height={980}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 3 – слайдер 3D / макеты + точки */}
        <section className={styles.section3}>
          <div className={styles.sliderContainer}>
            {/* СЛАЙДЕР */}
            <div className={styles.sliderViewport}>
              <div
                className={styles.sliderTrack}
                style={{ transform: `translateX(-${sliderIndex * 100}%)` }}
              >
                {SLIDER_SLIDES.map((slide, index) => (
                  <div key={index} className={styles.slide}>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 1024px) 1200px, 100vw"
                      quality={85}
                      className={styles.slideImage}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ТОЧКИ */}
            <div className={styles.dots}>
              {SLIDER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === sliderIndex ? styles.active : ""
                  }`}
                  onClick={() => setSliderIndex(index)}
                  aria-label={`slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 – один текст в белой карточке по центру */}
        <section className={styles.section4}>
          <div className={styles.section4Card}>
            <p>{t("sany.section4")}</p>
          </div>
        </section>

        {/* SECTION 5 – баннер слева, текст справа */}
        <section className={styles.section5}>
          <div className={styles.section5BannerWrap}>
            <Image
              src={getMediaUrl("/projects-pages/sany/sany-section3.png")}
              alt="Sany новогодний баннер"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section5Text}>
            <p>{t("sany.section5")}</p>
          </div>
        </section>

        {/* SECTION 6 – итоги слева, приглашение справа */}
        <section className={styles.section6}>
          <div className={styles.section6Text}>
            <span>{t("results")}</span>
            <p>{t("sany.resultsText")}</p>
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/sany/section4.png")}
              alt="Sany приглашение"
              width={410}
              height={650}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>
      </div>
    </>
  );
}
