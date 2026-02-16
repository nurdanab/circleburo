"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Project.module.scss";
import Link from "next/link";
import { PROJECTS as PROJECTS_DATA } from "@/app/lib/constants";
import { getMediaUrl } from "@/app/lib/media";

type Project = {
  slug: string;
  name: string;
  label: string;
  src: string;
  isVideo: boolean;
};

export default function ProjectSection({
  PROJECTS = PROJECTS_DATA,
}: {
  PROJECTS?: Project[];
}) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.inner}>
        <h2 className={styles.title}>наши проекты</h2>

        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={styles.card}
              aria-label={`Перейти к проекту ${project.name}`}
            >
              <div className={styles.cardMedia}>
                {project.isVideo ? (
                  <video
                    className={styles.cardMediaContent}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={project.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={project.src}
                    alt={project.name}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className={styles.cardMediaContent}
                  />
                )}

                <div className={styles.cardOverlay}>
                  <div className={styles.cardHeader}>
                    <button className={styles.cardTag}>{project.label}</button>
                    <button
                      type="button"
                      className={styles.cardIconBtn}
                      aria-label={`Перейти к проекту ${project.name}`}
                    >
                      <Image
                        src="/projects-video/icons/arrow-up-right-video.svg"
                        alt=""
                        width={8}
                        height={8}
                      />
                    </button>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.nextButton}>
                      <span>Next</span>
                      <Image
                        src="/projects-video/icons/arrow-right-video.svg"
                        alt=""
                        width={16}
                        height={16}
                        className={styles.nextIcon}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.slider}>
          <button
            className={styles.arrowBtn}
            onClick={prevSlide}
            aria-label="Previous"
          >
            <Image src={getMediaUrl("/calendar/Left 2.svg")} alt="" width={24} height={24} />
          </button>

          <div className={styles.slideWrapper}>
            <article className={styles.slide}>
              {PROJECTS[currentSlide].isVideo ? (
                <video
                  className={styles.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={PROJECTS[currentSlide].src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={PROJECTS[currentSlide].src}
                  alt={PROJECTS[currentSlide].name}
                  fill
                  sizes="(max-width: 767px) 100vw, 220px"
                  className={styles.image}
                />
              )}
            </article>
          </div>

          <button
            className={styles.arrowBtn}
            onClick={nextSlide}
            aria-label="Next"
          >
            <Image src={getMediaUrl("/calendar/Right 2.svg")} alt="" width={24} height={24} />
          </button>
        </div>

        <div className={styles.dots}>
          {PROJECTS.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
