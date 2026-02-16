import styles from "./WebHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function WebHero() {
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
        <source src={getMediaUrl("/show-cases/web/video-web.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
