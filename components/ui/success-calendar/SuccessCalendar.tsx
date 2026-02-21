"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./SuccessCalendar.module.scss";

interface SuccessCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessCalendar({ isOpen, onClose }: SuccessCalendarProps) {
  const t = useTranslations("successCalendar");
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Image
          src={getMediaUrl("/calendar/success-calendar-bg.png")}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, 500px"
          quality={75}
          className={styles.bgImage}
        />
        <button className={styles.closeBtn} onClick={onClose}>
          <span>×</span>
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("title")}</h2>
          <div className={styles.icon}>
            <Image src={getMediaUrl("/calendar/Check 02.31.42.svg")} alt="Success" width={36} height={36} unoptimized />
          </div>
        </div>
      </div>
    </div>
  );
}
