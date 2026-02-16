import Image from "next/image";

import styles from "./citix.module.scss";

export default function SteppeCoffeeProject() {
  return (
    <main className={styles.citixPage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/citix/hero.png"
            alt="Citix hero"
            width={520}
            height={920}
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
          <Image
            src="/projects-pages/citix/citix-logo.png"
            alt="Citix logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
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
          <Image
            src="/projects-pages/citix/citix-logo.png"
            alt="Citix logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>
    </main>
  );
}
