"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./contact.module.scss";
import Calendar from "@/app/components/ui/calendar/calendar";

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

          <button type="submit" className={styles.btn}>
            <span className={styles.checkIcon}>
              <Image src="/Check.svg" alt="Check" width={14} height={14} />
            </span>
            записаться на консультацию
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
