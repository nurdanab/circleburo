import { getMediaUrl } from "@/lib/media";
import styles from "./BrandMark.module.scss";

export default function BrandMark() {
  return (
    <section className={styles.brandMark}>
      <video
        src={getMediaUrl("/about/brand-mark.mp4")}
        className={styles.bgImage}
        autoPlay
        loop
        playsInline
        preload="metadata"
      />
    </section>
  );
}
