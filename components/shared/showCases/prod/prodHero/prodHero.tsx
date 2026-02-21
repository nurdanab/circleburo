import styles from "./prodHero.module.scss";

export default function ProdHero() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.video}
        autoPlay
        loop
        playsInline
        preload="metadata"
      >
        <source src="/show-cases/prod/prod-hero.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
