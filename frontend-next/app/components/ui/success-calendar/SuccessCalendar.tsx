"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./SuccessCalendar.module.scss";
import { getMediaUrl } from "@/app/lib/media";

interface SuccessCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessCalendar({ isOpen, onClose }: SuccessCalendarProps) {
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
          className={styles.bgImage}
        />
        <button className={styles.closeBtn} onClick={onClose}>
          <span>×</span>
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>вы записаны!</h2>
          <div className={styles.icon}>
            <Image src={getMediaUrl("/calendar/Check 02.31.42.svg")} alt="Success" width={36} height={36} />
          </div>
        </div>
      </div>
    </div>
  );
}
