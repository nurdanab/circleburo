import styles from "./DesignHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function DesignHero() {
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
        <source src={getMediaUrl("/show-cases/design/video-design.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}

