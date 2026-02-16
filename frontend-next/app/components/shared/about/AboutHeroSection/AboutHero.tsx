import Image from "next/image";
import styles from "./AboutHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Image
          src={getMediaUrl("/about/about-hero.png")}
          alt="О нас — CIRCLE Creative Buro"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleLight}>О</span>
            <span className={styles.titleAccent}> нас</span>
          </h1>
          <p className={styles.description}>
            Всё начиналось с небольшой кофейни, где начал раскрываться потенциал людей.
            <br />
            Пять людей собирали хаос в единый ритм. Разные люди, но одинаково горящие
            <br />
            и каждый добавил в круг свою точку. Точки начали соединяться.
            <br />
            Дизайн. Маркетинг. Стратегия. Смысл. Драйв.
          </p>
        </div>
      </div>
    </section>
  );
}
