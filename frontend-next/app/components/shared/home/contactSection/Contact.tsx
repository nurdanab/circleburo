"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Contact.module.scss";
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

export default function ContactSection() {
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
    // Auto-submit when date/time is selected
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
        setSubmitError('Это время уже занято. Пожалуйста, выберите другое время.');
      } else {
        setSubmitError('Произошла ошибка. Попробуйте позже.');
      }
      return;
    }

    setShowSuccess(true);
    setFormData({ name: "", phone: "" });
  };

  const openCalendar = () => {
    // Validate name and phone before opening calendar
    if (!formData.name.trim()) {
      setSubmitError('Пожалуйста, введите ваше имя');
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError('Пожалуйста, введите номер телефона');
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
        <h2 className={styles.title}>свяжитесь с нами</h2>
        <p className={styles.subtitle}>
          Запишитесь на консультацию к нашему эксперту, чтобы обсудить
          требования
          <br />к вашему проекту и получить индивидуальные рекомендации
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Ваше имя</label>
            <input
              type="text"
              name="name"
              placeholder="Введите Ваше имя"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Номер телефона</label>
            <input
              type="tel"
              name="phone"
              placeholder="+7 (___) ___-__-__"
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
            {isSubmitting ? 'Отправка...' : 'записаться на консультацию'}
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
