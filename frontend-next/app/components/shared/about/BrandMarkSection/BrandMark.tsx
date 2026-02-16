import styles from "./BrandMark.module.scss";
import Image from "next/image";
import { getMediaUrl } from "@/app/lib/media";

export default function BrandMark() {
  return (
    <section className={styles.brandMark}>
      <Image
        src={getMediaUrl("/about/brand-mark.png")}
        alt="BrandMark background"
        fill
        className={styles.bgImage}
      />
    </section>
  );
}
