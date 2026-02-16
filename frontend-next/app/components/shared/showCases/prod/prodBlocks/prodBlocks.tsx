import styles from "./prodBlocks.module.scss";

export default function ProdBlocks() {
  return (
    <section className={styles.section}>
      <div className={styles.item}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/show-cases/prod/block1.mp4" type="video/mp4" />
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
          <source src="/show-cases/prod/block2.mp4" type="video/mp4" />
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
          <source src="/show-cases/prod/block3.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
