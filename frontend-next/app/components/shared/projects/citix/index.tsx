import Image from "next/image";

import { getMediaUrl } from "@/app/lib/media";
import styles from "./citix.module.scss";

export default function CitixProject() {
  return (
    <main className={styles.citixPage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/citix/hero.png")}
            alt="Citix hero"
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <span>Citix</span>
          <p>
            Circle работал с Citix в рамках разработки моушн-дизайна для
            маркетинговых и коммуникационных задач бренда. Проект был направлен
            на визуализацию ключевых идей и технологических решений компании
            через динамичные анимационные форматы.
          </p>
        </div>

        <div>
          <video autoPlay muted loop playsInline className={styles.sectionBg}>
            <source
              src={getMediaUrl("/projects-pages/citix/section1.mp4")}
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className={styles.section3}>
        <div>
          <span>Итоги</span>
          <p>
            В результате Citix получил моушн-контент, который органично
            встроился в коммуникационную стратегию бренда и усилил визуальное
            представление его технологических решений.
          </p>
        </div>

        <div>
          <video autoPlay muted loop playsInline className={styles.sectionBg}>
            <source
              src={getMediaUrl("/projects-pages/citix/section2.mp4")}
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    </main>
  );
}
