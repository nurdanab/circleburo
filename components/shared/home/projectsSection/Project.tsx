"use client";

import { Link } from "@/i18n/navigation";
import { PROJECTS as PROJECTS_DATA } from "@/lib/constants";
import { getMediaUrl } from "@/lib/media";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import styles from "./Project.module.scss";

type Project = {
  slug: string;
  name: string;
  label: string;
  src: string;
  isVideo: boolean;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectSection({
  PROJECTS = PROJECTS_DATA,
}: {
  PROJECTS?: Project[];
}) {
  const t = useTranslations("common");
  const tHome = useTranslations("home");
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
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.h2 className={styles.title} variants={sectionVariants}>
          {tHome("projectsTitle")}
        </motion.h2>

        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={styles.card}
              aria-label={`${t("goToProject")} ${project.name}`}
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
                    <source src={getMediaUrl(project.src)} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={getMediaUrl(project.src)}
                    alt={project.name}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    quality={75}
                    className={styles.cardMediaContent}
                  />
                )}

                <div className={styles.cardOverlay}>
                  <div className={styles.cardHeader}>
                    <button className={styles.cardTag}>{project.label}</button>
                    <button
                      type="button"
                      className={styles.cardIconBtn}
                      aria-label={`${t("goToProject")} ${project.name}`}
                    >
                      <Image
                        src={getMediaUrl("/projects-video/icons/arrow-up-right-video.svg")}
                        unoptimized
                        alt=""
                        width={8}
                        height={8}
                      />
                    </button>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.nextButton}>
                      <span>{t("next")}</span>
                      <Image
                        src={getMediaUrl("/projects-video/icons/arrow-right-video.svg")}
                        unoptimized
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
            aria-label={t("prevSlide")}
          >
            <Image
              src={getMediaUrl("/calendar/Left 2.svg")}
              alt=""
              width={24}
              height={24}
              unoptimized
            />
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
                  <source src={getMediaUrl(PROJECTS[currentSlide].src)} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={getMediaUrl(PROJECTS[currentSlide].src)}
                  alt={PROJECTS[currentSlide].name}
                  fill
                  sizes="(max-width: 767px) 100vw, 220px"
                  quality={75}
                  className={styles.image}
                />
              )}
            </article>
          </div>

          <button
            className={styles.arrowBtn}
            onClick={nextSlide}
            aria-label={t("nextSlide")}
          >
            <Image
              src={getMediaUrl("/calendar/Right 2.svg")}
              alt=""
              width={24}
              height={24}
              unoptimized
            />
          </button>
        </div>

        <div className={styles.dots}>
          {PROJECTS.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`${t("goToSlide")} ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
