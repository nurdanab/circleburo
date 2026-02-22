import { getMediaUrl } from "@/lib/media";
import styles from "./WebHero.module.scss";

export default function WebHero() {
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
        <source src={getMediaUrl("/show-cases/web/video-web.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
