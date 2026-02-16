import Image from "next/image";
import styles from "./Benefits.module.scss";

const BENEFITS = [
  {
    title: "комплексный подход",
    description:
      "Полностью берем на себя маркетинг, чтобы вы сосредоточились на своем деле",
  },
  {
    title: "честность и надежность",
    description: "Не продаем иллюзии, даем честный результат",
  },
  {
    title: "отсутствие шаблонов",
    description:
      "Креативная команда которая создаёт уникальные идеи и использует тренды из разных сфер",
  },
];

export default function Benefits() {
  return (
    <section className={styles.benefits}>
      <Image
        src="/home/benefits.png"
        alt="Benefits background"
        fill
        className={styles.bgImage}
      />

      <div className={styles.inner}>
        <h2 className={styles.title}>ПОЧЕМУ МЫ?</h2>

        <div className={styles.container}>
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardText}>{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
