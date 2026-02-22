import { getMediaUrl } from "@/lib/media";
import styles from "./InterierHero.module.scss";

export default function InterierHero() {
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
        <source src={getMediaUrl("/show-cases/interier/video-interier.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}

