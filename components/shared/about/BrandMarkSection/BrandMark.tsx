"use client";

import { useRef } from "react";
import { getMediaUrl } from "@/lib/media";
import styles from "./BrandMark.module.scss";

export default function BrandMark() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  return (
    <section className={styles.brandMark}>
      <video
        ref={videoRef}
        src={getMediaUrl("/about/brand-mark.mp4")}
        className={styles.bgImage}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onClick={toggleSound}
        style={{ cursor: "pointer" }}
      />
    </section>
  );
}
