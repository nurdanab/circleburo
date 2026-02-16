"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./contact.module.scss";
import Calendar from "@/app/components/ui/calendar/calendar";
import { api } from "@/app/lib/api";
import { getMediaUrl } from "@/app/lib/media";

export default function ContactPage() {
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
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFormData((prev) => ({ ...prev, date: formattedDate, time }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Convert date from DD.MM.YYYY to YYYY-MM-DD format for API
    const [day, month, year] = formData.date.split(".");
    const apiDate = `${year}-${month}-${day}`;

    const result = await api.createLead({
      name: formData.name,
      phone: formData.phone,
      meeting_date: apiDate,
      meeting_time: formData.time,
    });

    setIsSubmitting(false);

    if (result.error) {
      setSubmitMessage({ type: "error", text: "Ошибка при отправке. Попробуйте еще раз." });
    } else {
      setSubmitMessage({ type: "success", text: "Заявка успешно отправлена!" });
      setFormData({ name: "", phone: "", date: "", time: "" });
    }
  };

  const openCalendar = () => {
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
        <h2 className={styles.title}>свяжитесь с нами</h2>
        <p className={styles.subtitle}>
          Запишитесь на консультацию к нашему эксперту, чтобы обсудить
          требования
          <br />к вашему проекту и получить индивидуальные рекомендации
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Ваше имя</label>
            <input
              type="text"
              name="name"
              placeholder="Введите Ваше имя"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Номер телефона</label>
            <input
              type="tel"
              name="phone"
              placeholder="Введите Номер телефона"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Выберите дату</label>
            <div className={styles.dateWrapper} onClick={openCalendar}>
              <Image
                src="/Calendar.svg"
                alt="Calendar"
                width={20}
                height={20}
                className={styles.calendarIcon}
              />
              <input
                type="text"
                name="date"
                placeholder="Выберите дату"
                value={formData.date ? `${formData.date} ${formData.time}` : ""}
                className={styles.input}
                readOnly
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={isSubmitting}>
            <span className={styles.checkIcon}>
              <Image src="/Check.svg" alt="Check" width={14} height={14} />
            </span>
            {isSubmitting ? "отправка..." : "записаться на консультацию"}
          </button>

          {submitMessage && (
            <p style={{
              textAlign: "center",
              color: submitMessage.type === "success" ? "#4ade80" : "#f87171",
              marginTop: "8px"
            }}>
              {submitMessage.text}
            </p>
          )}
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
