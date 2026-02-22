"use client";

import Calendar from "@/components/ui/calendar/calendar";
import { getMediaUrl } from "@/lib/media";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import styles from "./Contact.module.scss";

const getLocaleForFormatting = (locale: string): string => {
  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    kz: "kk-KZ",
    zh: "zh-CN",
  };
  return localeMap[locale] || "ru-RU";
};

export default function ContactSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    rawDate: "", // ISO format for API
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleDateSelect = (date: Date, time: string) => {
    const formattedDate = date.toLocaleDateString(
      getLocaleForFormatting(locale),
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
    // ISO format for API: YYYY-MM-DD
    const isoDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: formattedDate, time, rawDate: isoDate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await api.createLead({
      name: formData.name,
      phone: formData.phone.replace(/\D/g, ""), // Remove non-digits
      meeting_date: formData.rawDate,
      meeting_time: formData.time,
    });

    setIsSubmitting(false);

    if (result.error) {
      if (result.error.includes("already booked")) {
        setSubmitError("Это время уже занято. Пожалуйста, выберите другое время.");
      } else {
        setSubmitError("Произошла ошибка. Попробуйте позже.");
      }
      return;
    }

    setIsSuccess(true);
    setFormData({ name: "", phone: "", date: "", time: "", rawDate: "" });

    // Reset success state after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <Image
        src={getMediaUrl("/home/4.png")}
        alt={t("contactAltBackground")}
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />

      <div className={styles.inner}>
        <h2 className={styles.title}>{t("contactTitle")}</h2>
        <p className={styles.subtitle}>{t("contactSubtitle")}</p>

        {isSuccess ? (
          <div className={styles.successMessage}>
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>{t("contactLabelName")}</label>
              <input
                type="text"
                name="name"
                placeholder={t("contactPlaceholderName")}
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t("contactLabelPhone")}</label>
              <input
                type="tel"
                name="phone"
                placeholder={t("contactPlaceholderPhone")}
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t("contactLabelDate")}</label>
              <div className={styles.dateWrapper} onClick={openCalendar}>
                <Image
                  src={getMediaUrl("/Calendar.svg")}
                  unoptimized
                  alt={t("contactAltCalendar")}
                  width={20}
                  height={20}
                  className={styles.calendarIcon}
                />
                <input
                  type="text"
                  name="date"
                  placeholder={t("contactPlaceholderDate")}
                  value={formData.date ? `${formData.date} ${formData.time}` : ""}
                  className={styles.input}
                  readOnly
                  required
                />
              </div>
            </div>

            {submitError && (
              <div className={styles.errorMessage}>{submitError}</div>
            )}

            <button type="submit" className={styles.btn} disabled={isSubmitting}>
              <span className={styles.checkIcon}>
                <Image
                  src={getMediaUrl("/Check.svg")}
                  alt={t("contactAltCheck")}
                  width={14}
                  height={14}
                  unoptimized
                />
              </span>
              {isSubmitting ? "Отправка..." : t("contactSubmit")}
            </button>
          </form>
        )}
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={handleDateSelect}
      />
    </section>
  );
}
