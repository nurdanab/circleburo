"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./sany.module.scss";

const SLIDER_SLIDES = [
  { src: "/projects-pages/sany/section2.jpg", alt: "Sany — слайд 1" },
  { src: "/projects-pages/sany/section3.png", alt: "Sany — слайд 2" },
  { src: "/projects-pages/sany/section3.png", alt: "Sany — слайд 3" },
  { src: "/projects-pages/sany/section4.png", alt: "Sany — слайд 4" },
];

export default function SanyProject() {
  const [sliderIndex, setSliderIndex] = useState(0);

  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/sany/hero.png"
            alt="Sany hero — Quality changes the world"
            fill
            priority
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – текст слева, фото интерьера справа */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>sany</span>
            <p>
              Circle подключился к проекту Sany с задачей систематизировать и
              усилить визуальную среду бренда в офлайн-пространстве. Работа была
              направлена на формирование единого и последовательно выстроенного
              визуального подхода в корпоративных и выставочных помещениях.
            </p>
          </div>
          <div className={styles.section2ImgWrap}>
            <Image
              src="/projects-pages/sany/section1.jpg"
              alt="Sany интерьер"
              width={620}
              height={980}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 3 – слайдер 3D / макеты + точки */}
        <section className={styles.section3}>
          <div className={styles.section3SliderWrap}>
            <div
              className={styles.section3Track}
              style={{ transform: `translateX(-${sliderIndex * 100}%)` }}
            >
              {SLIDER_SLIDES.map((slide, index) => (
                <div key={index} className={styles.section3Slide}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 1024px) 1200px, 100vw"
                    className={styles.section3SlideImage}
                  />
                </div>
              ))}
            </div>
            <div className={styles.section3Dots}>
              {SLIDER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.section3Dot} ${
                    index === sliderIndex ? styles.section3DotActive : ""
                  }`}
                  aria-label={`Слайд ${index + 1}`}
                  onClick={() => setSliderIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 – один текст в белой карточке по центру */}
        <section className={styles.section4}>
          <div className={styles.section4Card}>
            <p>
              В рамках проекта Circle занимался разработкой интерьерных решений
              для различных зон компании. Мы работали с пространственной
              логикой, визуальными акцентами и деталями оформления, обеспечивая
              функциональность помещений и соответствие корпоративному стилю
              бренда. Офисные и выставочные пространства рассматривались как
              элементы единой визуальной системы, поддерживающей профессиональный
              и технологичный образ компании.
            </p>
          </div>
        </section>

        {/* SECTION 5 – баннер слева, текст справа */}
        <section className={styles.section5}>
          <div className={styles.section5BannerWrap}>
            <Image
              src="/projects-pages/sany/section4.png"
              alt="Sany новогодний баннер"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section5Text}>
            <p>
              Дополнительно Circle разработал печатные материалы для
              офлайн-коммуникаций, включая постеры. В работе был сделан акцент на
              чёткую структуру информации, визуальную сдержанность и
              соответствие фирменному стилю. Печатные носители дополняли
              пространство и усиливали общее восприятие бренда.
            </p>
          </div>
        </section>

        {/* SECTION 6 – итоги слева, приглашение справа */}
        <section className={styles.section6}>
          <div className={styles.section6Text}>
            <span>итоги</span>
            <p>
              Сотрудничество с Sany носит долгосрочный характер и продолжается.
              Circle выступает визуальным партнером бренда, обеспечивая
              последовательное развитие оффлайн-среды и поддержку целостного
              образа компании в пространстве и коммуникациях.
            </p>
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/sany/section4.png"
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
