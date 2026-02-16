import Image from "next/image";
import styles from "./DesignBlocks.module.scss";

export default function DesignBlocks() {
  return (
    <section className={styles.section}>
      <div className={styles.item}>
        <Image
          src="/show-cases/design/block-1.png"
          alt="Design case block 1"
          className={styles.image}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>

      <div className={styles.item}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/show-cases/design/block2.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={styles.item}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/show-cases/design/block3.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

