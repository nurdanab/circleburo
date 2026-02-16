"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Contact.module.scss";
import Calendar from "@/app/components/ui/calendar/calendar";
import { api } from "@/app/lib/api";
import { getMediaUrl } from "@/app/lib/media";

export default function ContactSection() {
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
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    // ISO format for API: YYYY-MM-DD
    const isoDate = date.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, date: formattedDate, time, rawDate: isoDate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await api.createLead({
      name: formData.name,
      phone: formData.phone.replace(/\D/g, ''), // Remove non-digits
      meeting_date: formData.rawDate,
      meeting_time: formData.time,
    });

    setIsSubmitting(false);

    if (result.error) {
      if (result.error.includes('already booked')) {
        setSubmitError('Это время уже занято. Пожалуйста, выберите другое время.');
      } else {
        setSubmitError('Произошла ошибка. Попробуйте позже.');
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

        {isSuccess ? (
          <div className={styles.successMessage}>
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
          </div>
        ) : (
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Выберите дату</label>
              <div className={styles.dateWrapper} onClick={isSubmitting ? undefined : openCalendar}>
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {submitError && (
              <div className={styles.errorMessage}>{submitError}</div>
            )}

            <button type="submit" className={styles.btn} disabled={isSubmitting}>
              <span className={styles.checkIcon}>
                <Image src="/Check.svg" alt="Check" width={14} height={14} />
              </span>
              {isSubmitting ? 'Отправка...' : 'записаться на консультацию'}
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
