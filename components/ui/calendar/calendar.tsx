"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import { api } from "@/lib/api";
import styles from "./calendar.module.scss";

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}

const AVAILABLE_TIMES = [
  "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

// Normalize time format: "09:00" -> "9:00", "9:00" -> "9:00"
const normalizeTime = (time: string): string => {
  return time.replace(/^0/, "");
};

// Simulated unavailable dates (weekends and some random dates)
const isDateUnavailable = (date: Date): boolean => {
  const day = date.getDay();
  // Weekends are unavailable
  if (day === 0 || day === 6) return true;
  // Past dates are unavailable
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return true;
  return false;
};

export default function Calendar({ isOpen, onClose, onConfirm }: CalendarProps) {
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const weekdays = [0, 1, 2, 3, 4, 5, 6].map((i) => t(`weekday${i}`));
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => t(`month${i}`));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get day of week for first day (0 = Sunday, convert to Monday-based)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = async (day: number) => {
    const date = new Date(year, month, day);
    if (!isDateUnavailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes

      // Fetch booked slots for this date
      setLoadingSlots(true);
      const isoDate = date.toISOString().split("T")[0];
      const result = await api.getBookedSlots(isoDate);

      if (result.data) {
        const booked = result.data
          .filter(lead => lead.status === "pending" || lead.status === "confirmed")
          .map(lead => normalizeTime(lead.meeting_time));
        setBookedTimes(booked);
      } else {
        setBookedTimes([]);
      }
      setLoadingSlots(false);
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onClose();
      setSelectedDate(null);
      setSelectedTime(null);
      setBookedTimes([]);
    }
  };

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
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before start of month
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className={styles.dayEmpty} />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isUnavailable = isDateUnavailable(date);
    const isSelected = selectedDate?.getDate() === day && 
                       selectedDate?.getMonth() === month && 
                       selectedDate?.getFullYear() === year;
    
    calendarDays.push(
      <button
        key={day}
        className={`${styles.day} ${isUnavailable ? styles.unavailable : styles.available} ${isSelected ? styles.selected : ""}`}
        onClick={() => handleDateClick(day)}
        disabled={isUnavailable}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Image
          src={getMediaUrl("/calendar/calendar-bg.png")}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, 600px"
          quality={75}
          className={styles.modalBg}
        />
        
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Image src={getMediaUrl("/calendar/Calendar 02.31.42.svg")} alt="" width={24} height={24} unoptimized />
              <span>{t("chooseDateAndTime")}</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <span>×</span>
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.calendarSection}>
              <div className={styles.calendarCard}>
                <div className={styles.monthNav}>
                  <button className={styles.navBtn} onClick={prevMonth}>
                    <Image src={getMediaUrl("/calendar/Left 2.svg")} alt="Previous" width={24} height={24} unoptimized />
                  </button>
                  <span className={styles.monthYear}>
                    {months[month]} {year}
                  </span>
                  <button className={styles.navBtn} onClick={nextMonth}>
                    <Image src={getMediaUrl("/calendar/Right 2.svg")} alt="Next" width={24} height={24} unoptimized />
                  </button>
                </div>

                <div className={styles.weekdays}>
                  {weekdays.map((day) => (
                    <span key={day} className={styles.weekday}>{day}</span>
                  ))}
                </div>

                <div className={styles.daysGrid}>
                  {calendarDays}
                </div>

                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.selectedDot}`} />
                    <span>{t("selected")}</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.availableDot}`} />
                    <span>{t("available")}</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.unavailableDot}`} />
                    <span>{t("unavailable")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timeSection}>
              <div className={styles.timeCard}>
                <div className={styles.timeHeader}>
                  <Image src={getMediaUrl("/calendar/Time Circle.svg")} alt="" width={20} height={20} unoptimized />
                  <span>{t("availableTime")}</span>
                </div>
                <div className={styles.timeGrid}>
                  {AVAILABLE_TIMES.map((time, idx) => {
                    const isBooked = bookedTimes.includes(time);
                    return (
                      <button
                        key={idx}
                        className={`${styles.timeBtn} ${selectedTime === time ? styles.timeSelected : ""} ${isBooked ? styles.timeBooked : ""}`}
                        onClick={() => handleTimeClick(time)}
                        disabled={isBooked || loadingSlots}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            <span className={styles.confirmIcon}>
              <Image src={getMediaUrl("/calendar/Check 02.31.42.svg")} alt="" width={16} height={16} unoptimized />
            </span>
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
