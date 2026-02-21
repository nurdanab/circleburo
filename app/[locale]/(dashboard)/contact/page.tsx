"use client";

import Calendar from "@/components/ui/calendar/calendar";
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
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData((prev) => ({ ...prev, date: formattedDate, time }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", phone: "", date: "", time: "" });
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <Image
        src="/home/contact.png"
        alt={t("altBackground")}
        fill
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
                src="/Calendar.svg"
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

          <button type="submit" className={styles.btn}>
            <span className={styles.checkIcon}>
              <Image
                src="/Check.svg"
                alt={t("altCheck")}
                width={14}
                height={14}
                unoptimized
              />
            </span>
            {t("submit")}
          </button>
        </form>
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={handleDateSelect}
      />
    </section>
  );
}
