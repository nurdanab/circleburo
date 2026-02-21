"use client";

import { useRef, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import styles from "./Hero.module.scss";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <video
          ref={videoRef}
          src={getMediaUrl("/home/hero-main-video.mp4")}
          className={styles.heroImage}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onClick={handleVideoClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </section>
  );
}
