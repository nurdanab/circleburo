"use client";

import { useRef, useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import styles from "./ShowCase.module.scss";

export default function ShowCase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            video.play();
            setHasPlayed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [hasPlayed]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  return (
    <section className={styles.showCase}>
      <video
        ref={videoRef}
        className={styles.bgVideo}
        muted
        playsInline
        preload="metadata"
        onClick={toggleSound}
        style={{ cursor: "pointer" }}
      >
        <source src={getMediaUrl("/home/show-case-viseo.mp4")} type="video/mp4" />
      </video>
    </section>
  );
}
