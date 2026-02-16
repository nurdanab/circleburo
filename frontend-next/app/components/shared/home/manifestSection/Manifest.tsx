import Image from "next/image";
import styles from "./Manifest.module.scss";

export default function Manifest() {
  return (
    <section className={styles.manifest}>
      <div className={styles.manifestInner}>
        <Image
          src="/home/manifest.png"
          alt="Manifest background"
          fill
          className={styles.bgImage}
          priority
        />

        <div className={styles.content}>
          <h2 className={styles.title}>
            <span className={styles.brand}>CIRCLE</span> - это про людей.
            <br />
            людей, которые умеют создавать.
            <br />
            чувствовать. видеть дальше.
          </h2>

          <p className={styles.subtitle}>
            Креативное агентство полного цикла, где маркетинг, дизайн раскрывает
            креативный <br /> и концептуальный потенциал брендов, замыкая его в
            непрерывный круг..
          </p>
        </div>
      </div>
    </section>
  );
}
