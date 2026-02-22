"use client";

import Calendar from "@/components/ui/calendar/calendar";
import SuccessCalendar from "@/components/ui/success-calendar/SuccessCalendar";
import { getMediaUrl } from "@/lib/media";
import { api } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import styles from "./contact.module.scss";

const getLocaleForFormatting = (locale: string): string => {
  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    kz: "kk-KZ",
    zh: "zh-CN",
  };
  return localeMap[locale] || "ru-RU";
};

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    rawDate: "",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      phone: formData.phone.replace(/\D/g, ""),
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

    setShowSuccessModal(true);
    setFormData({ name: "", phone: "", date: "", time: "", rawDate: "" });
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <Image
        src={getMediaUrl("/home/4.png")}
        alt={t("altBackground")}
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />

      <div className={styles.inner}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.subtitle}>{t("subtitle")}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>{t("labelName")}</label>
            <input
              type="text"
              name="name"
              placeholder={t("placeholderName")}
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t("labelPhone")}</label>
            <input
              type="tel"
              name="phone"
              placeholder={t("placeholderPhone")}
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t("labelDate")}</label>
            <div className={styles.dateWrapper} onClick={openCalendar}>
              <Image
                src={getMediaUrl("/Calendar.svg")}
                unoptimized
                alt={t("altCalendar")}
                width={20}
                height={20}
                className={styles.calendarIcon}
              />
              <input
                type="text"
                name="date"
                placeholder={t("placeholderDate")}
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
                alt={t("altCheck")}
                width={14}
                height={14}
                unoptimized
              />
            </span>
            {isSubmitting ? "Отправка..." : t("submit")}
          </button>
        </form>
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={handleDateSelect}
      />

      <SuccessCalendar
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </section>
  );
}
