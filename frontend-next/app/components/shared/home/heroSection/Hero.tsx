"use client";

import { useRef, useEffect } from "react";
import styles from "./Hero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={getMediaUrl("/home/hero-poster.png")}
          onClick={toggleSound}
        >
          <source src={getMediaUrl("/home/hero.mp4")} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
