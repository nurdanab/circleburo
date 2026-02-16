"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import styles from "./calendar.module.scss";
import { api } from "@/app/lib/api";
import { getMediaUrl } from "@/app/lib/media";

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

const AVAILABLE_TIMES = [
  "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get day of week for first day (0 = Sunday, convert to Monday-based)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Fetch booked slots when date is selected
  const fetchBookedSlots = useCallback(async (date: Date) => {
    setIsLoadingSlots(true);
    const isoDate = date.toISOString().split('T')[0];
    const result = await api.getBookedSlots(isoDate);

    if (result.data) {
      const booked = result.data
        .filter(lead => ['pending', 'confirmed'].includes(lead.status || ''))
        .map(lead => lead.meeting_time);
      setBookedTimes(booked);
    } else {
      setBookedTimes([]);
    }
    setIsLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate, fetchBookedSlots]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    if (!isDateUnavailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeClick = (time: string) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTime(time);
    }
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Image
          src={getMediaUrl("/calendar/calendar-bg.png")}
          alt=""
          fill
          className={styles.modalBg}
        />

        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Image src={getMediaUrl("/calendar/Calendar 02.31.42.svg")} alt="" width={24} height={24} />
              <span>выберите дату и время</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.calendarSection}>
              <div className={styles.calendarCard}>
                <div className={styles.monthNav}>
                  <button className={styles.navBtn} onClick={prevMonth}>
                    <Image src={getMediaUrl("/calendar/Left 2.svg")} alt="Previous" width={24} height={24} />
                  </button>
                  <span className={styles.monthYear}>
                    {MONTHS[month]} {year}
                  </span>
                  <button className={styles.navBtn} onClick={nextMonth}>
                    <Image src={getMediaUrl("/calendar/Right 2.svg")} alt="Next" width={24} height={24} />
                  </button>
                </div>

                <div className={styles.weekdays}>
                  {WEEKDAYS.map((day) => (
                    <span key={day} className={styles.weekday}>{day}</span>
                  ))}
                </div>

                <div className={styles.daysGrid}>
                  {calendarDays}
                </div>

                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.selectedDot}`} />
                    <span>Выбрано</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.availableDot}`} />
                    <span>Доступно</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.unavailableDot}`} />
                    <span>Недоступно</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timeSection}>
              <div className={styles.timeCard}>
                <div className={styles.timeHeader}>
                  <Image src={getMediaUrl("/calendar/Time Circle.svg")} alt="" width={20} height={20} />
                  <span>доступное время:</span>
                </div>
                {isLoadingSlots ? (
                  <div className={styles.loadingSlots}>Загрузка...</div>
                ) : (
                  <div className={styles.timeGrid}>
                    {AVAILABLE_TIMES.map((time, idx) => {
                      const isBooked = bookedTimes.includes(time);
                      return (
                        <button
                          key={idx}
                          className={`${styles.timeBtn} ${selectedTime === time ? styles.timeSelected : ""} ${isBooked ? styles.timeBooked : ""}`}
                          onClick={() => handleTimeClick(time)}
                          disabled={isBooked}
                          title={isBooked ? "Время занято" : ""}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            <span className={styles.confirmIcon}>
              <Image src={getMediaUrl("/calendar/Check 02.31.42.svg")} alt="" width={16} height={16} />
            </span>
            подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
