import { getMediaUrl } from "@/lib/media";
import styles from "./DesignHero.module.scss";

export default function DesignHero() {
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
        <source src={getMediaUrl("/show-cases/design/video-design.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}

