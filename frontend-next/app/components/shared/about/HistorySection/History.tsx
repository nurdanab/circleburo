import Image from "next/image";
import styles from "./History.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function History() {
  return (
    <section className={styles.history}>
      <Image
        src={getMediaUrl("/about/about-history-bg.png")}
        alt=""
        fill
        className={styles.bgImage}
      />
      <div className={styles.content}>
        <div className={styles.imageBlock}>
          <Image
            src={getMediaUrl("/about/about-hands.jpg")}
            alt="Наша команда"
            fill
            className={styles.handsImage}
          />
        </div>
        <div className={styles.textBlock}>
          <div className={styles.card}>
            <h2 className={styles.title}>наша история</h2>
            <p className={styles.description}>
              Начиная с маленькой команды, мы основали наше агентство
              в августе 2025 года и продолжаем расти. Мы стартовали
              с проекта Steppe Coffee, который показал нам реальные
              масштабы наших возможностей. Один успешный кейс потянул
              за собой следующий, и так мы выросли в полноценное агентство.
              Сейчас у нас несколько департаментов и амбициозные планы
              на будущее, но цель осталась прежней: делать крутые проекты
              и постоянно расти.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}