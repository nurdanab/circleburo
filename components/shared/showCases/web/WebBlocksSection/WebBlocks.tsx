import Image from "next/image";
import styles from "./WebBlocks.module.scss";

const blocks = [
  {
    id: 1,
    image: "/show-cases/web/block-1.png",
    alt: "Web case block- 1",
  },
  {
    id: 2,
    image: "/show-cases/web/block-2.png",
    alt: "Web case block- 2",
  },
  {
    id: 3,
    image: "/show-cases/web/block-3.png",
    alt: "Web case block- 3",
  },
  {
    id: 4,
    image: "/show-cases/web/block-4.png",
    alt: "Web case block- 4",
  },
];

export default function WebBlocks() {
  const [row1, row2] = [blocks.slice(0, 2), blocks.slice(2, 4)];

  return (
    <section className={styles.section}>
      <div className={styles.row}>
        {row1.map((block) => (
          <div key={block.id} className={styles.item}>
            <Image
              src={block.image}
              alt={block.alt}
              className={styles.image}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={85}
            />
          </div>
        ))}
      </div>
      <div className={styles.row}>
        {row2.map((block) => (
          <div key={block.id} className={styles.item}>
            <Image
              src={block.image}
              alt={block.alt}
              className={styles.image}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={85}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
