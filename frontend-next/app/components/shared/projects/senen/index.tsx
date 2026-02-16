import Image from "next/image";

import styles from "./senen.module.scss";

export default function SenenProject() {
  return (
    <main className={styles.senenPage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/steppe-coffee/hero.png"
            alt="Steppe Coffee hero"
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <span>Senen</span>
          <p>
            Senen – компания, специализирующаяся на производстве корпоративных
            подарочных боксов и персонализированных подарочных решений для
            бизнеса. Circle подключился к проекту с задачей системно оформить
            визуальную часть продукта и сопутствующие материалы, которые
            используются в работе с корпоративными клиентами. Важно было
            сохранить характер бренда и одновременно сделать коммуникацию более
            понятной и структурированной.
          </p>
        </div>
        <div>
          <Image
            src="/projects-pages/senen/senen-logo.png"
            alt="Senen logo"
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section3}>
        <Image
          src="/projects-pages/senen/senen-logo.png"
          alt="Senen logo"
          fill
          className={styles.sectionBg}
        />
      </section>

      <section className={styles.section4}>
        <p>
          Senen – компания, специализирующаяся на производстве корпоративных
          подарочных боксов и персонализированных подарочных решений для
          бизнеса. Circle подключился к проекту с задачей системно оформить
          визуальную часть продукта и сопутствующие материалы, которые
          используются в работе с корпоративными клиентами. Важно было сохранить
          характер бренда и одновременно сделать коммуникацию более понятной и
          структурированной.
        </p>
        <p>
          Следующим этапом стала разработка дизайна коммерческого предложения.
          Документ был выстроен так, чтобы четко и последовательно доносить
          ценность продукта, отражая стиль и позиционирование бренда.
        </p>
      </section>

      <section className={styles.section5}>
        <div>
          <Image
            src="/projects-pages/senen/senen-logo.png"
            alt="Senen logo"
            fill
            className={styles.sectionBg}
          />
        </div>
        <p>
          Дополнительно Circle разработал визуальные решения для элементов
          упаковки. В проект вошли открытки, обертки, а также этикетки для чая и
          шоколада. Все элементы были выполнены в едином визуальном ключе и
          согласованы между собой, чтобы упаковка воспринималась как цельный
          продукт.
        </p>
      </section>

      <section className={styles.section6}>
        <div>
          <Image
            src="/projects-pages/senen/senen-logo.png"
            alt="Senen logo"
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section7}>
        <span>Итоги</span>
        <p>
          В результате Senen получил структурированный набор визуальных и
          печатных материалов, усиливающих продукт и поддерживающих бренд на
          всех этапах взаимодействия с корпоративными клиентами.
        </p>
      </section>
    </main>
  );
}
