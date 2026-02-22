import { getMediaUrl } from "@/lib/media";
import styles from "./prodHero.module.scss";

export default function ProdHero() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={getMediaUrl("/show-cases/prod/prod-hero.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
