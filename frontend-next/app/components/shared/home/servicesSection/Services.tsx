import Image from "next/image";
import styles from "./Services.module.scss";
import Link from "next/link";

const SERVICES = [
  {
    title: "МОУШН",
    description:
      "направление дизайна, специализирующееся на создании анимированных динамических изображений",
  },
  {
    title: "ВЕБ-РАЗРАБОТКА",
    description: "создание и техническая поддержка сайта",
  },
  {
    title: "SMM",
    description:
      "создание уникального контента и продвижение в социальных сетях",
  },
  {
    title: "МАРКЕТИНГ",
    description:
      "изучения рыночных тенденций, разработка стратегии продвижения и каналов траффика",
  },
  {
    title: "ГРАФИЧЕСКИЙ ДИЗАЙН",
    description: "создание визуальной коммуникации бренда с потребителями",
  },
  {
    title: "ИНТЕРЬЕРНЫЙ ДИЗАЙН",
    description:
      "создание среды, которая усиливает бренд и формирует клиентский опыт",
  },
];

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <Image
        src="/home/services.png"
        alt="Services background"
        fill
        className={styles.bgImage}
      />

      <div className={styles.inner}>
        <h2 className={styles.title}>наши услуги</h2>

        <div className={styles.grid}>
          {SERVICES.map((service) => (
            <article key={service.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardText}>{service.description}</p>
            </article>
          ))}
        </div>

        <Link href="/services" className={styles.btn}>
          ПОДРОБНЕЕ <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </section>
  );
}
