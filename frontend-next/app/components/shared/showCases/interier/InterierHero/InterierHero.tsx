import styles from "./InterierHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function InterierHero() {
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
        <source src={getMediaUrl("/show-cases/interier/video-interier.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}

