"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./contact.module.scss";
import Calendar from "@/app/components/ui/calendar/calendar";
import SuccessCalendar from "@/app/components/ui/success-calendar/SuccessCalendar";
import { api } from "@/app/lib/api";
import { getMediaUrl } from "@/app/lib/media";

// Phone mask formatter for Kazakhstan numbers
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) return '';

  // Handle +7 or 8 at the start
  let normalized = digits;
  if (digits.startsWith('8') && digits.length > 1) {
    normalized = '7' + digits.slice(1);
  } else if (!digits.startsWith('7') && digits.length > 0) {
    normalized = '7' + digits;
  }

  // Format: +7 (XXX) XXX-XX-XX
  let result = '+7';
  if (normalized.length > 1) {
    result += ' (' + normalized.slice(1, 4);
  }
  if (normalized.length >= 4) {
    result += ') ' + normalized.slice(4, 7);
  }
  if (normalized.length >= 7) {
    result += '-' + normalized.slice(7, 9);
  }
  if (normalized.length >= 9) {
    result += '-' + normalized.slice(9, 11);
  }

  return result;
};

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setSubmitError(null);
  };

  const handleDateSelect = async (date: Date, time: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const isoDate = date.toISOString().split('T')[0];

    const result = await api.createLead({
      name: formData.name,
      phone: formData.phone.replace(/\D/g, ''),
      meeting_date: isoDate,
      meeting_time: time,
    });

    setIsSubmitting(false);

    if (result.error) {
      if (result.error.includes('already booked')) {
        setSubmitError(t("errorTimeBooked"));
      } else {
        setSubmitError(t("errorGeneral"));
      }
      return;
    }

    setShowSuccess(true);
    setFormData({ name: "", phone: "" });
  };

  const openCalendar = () => {
    if (!formData.name.trim()) {
      setSubmitError(t("errorName"));
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError(t("errorPhone"));
      return;
    }
    setSubmitError(null);
    setIsCalendarOpen(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <Image
        src={getMediaUrl("/home/contact.png")}
        alt="Contact background"
        fill
        className={styles.bgImage}
      />

      <div className={styles.inner}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.subtitle}>
          {t("subtitle").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < t("subtitle").split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t("nameLabel")}</label>
            <input
              type="text"
              name="name"
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t("phoneLabel")}</label>
            <input
              type="tel"
              name="phone"
              placeholder={t("phonePlaceholder")}
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          {submitError && (
            <div className={styles.errorMessage}>{submitError}</div>
          )}

          <button
            type="button"
            className={styles.btn}
            onClick={openCalendar}
            disabled={isSubmitting}
          >
            <span className={styles.checkIcon}>
              <Image src={getMediaUrl("/Check.svg")} alt="Check" width={14} height={14} />
            </span>
            {isSubmitting ? t("submitting") : t("submitButton")}
          </button>
        </div>
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={handleDateSelect}
      />

      <SuccessCalendar
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </section>
  );
}
