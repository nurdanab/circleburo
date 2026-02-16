import styles from "./prodHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function ProdHero() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={getMediaUrl("/show-cases/prod/prod-hero.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
