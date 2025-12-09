import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, User, Phone, Check, X, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

const STATUS_LABELS = {
  [BOOKING_STATUSES.PENDING]: 'Pending',
  [BOOKING_STATUSES.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled'
};

const STATUS_COLORS = {
  [BOOKING_STATUSES.PENDING]: 'text-yellow-400',
  [BOOKING_STATUSES.CONFIRMED]: 'text-green-400',
  [BOOKING_STATUSES.CANCELLED]: 'text-red-400'
};

const ContactFormSection = () => {
  const { t } = useTranslation();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '+7 '
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(BOOKING_STATUSES.PENDING);

  // Refs for GSAP animations (minimal)
  const titleRef = useRef(null);
  const confirmationRef = useRef(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Состояние для текущего месяца календаря
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);

    let count = 0;
    while (count < 30) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dates.push(new Date(currentDate));
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  // Функции для календаря
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Проверяем, что дата не в прошлом
    if (date < today) return false;

    // Проверяем, что это рабочий день (пн-пт)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    // Проверяем, что дата в списке доступных
    return availableDates.some(availableDate =>
      availableDate.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const monthNames = [
    t('calendar.january'), t('calendar.february'), t('calendar.march'), t('calendar.april'),
    t('calendar.may'), t('calendar.june'), t('calendar.july'), t('calendar.august'),
    t('calendar.september'), t('calendar.october'), t('calendar.november'), t('calendar.december')
  ];

  const dayNames = [t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')];

  const loadBookedSlots = useCallback(async (date) => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    setLoadingSlots(true);

    const dateNoTimezone = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dateStr = dateNoTimezone.toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('leads')
        .eq('meeting_date', dateStr)
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED])
        .order('meeting_time', { ascending: true })
        .select('meeting_time, status, id, name');

      if (error) throw error;

      const normalized = (data || []).map(slot => ({
        ...slot,
        meeting_time: slot.meeting_time.slice(0,5)
      }));

      setBookedSlots(normalized);

    } catch (err) {
      setError(t('contactForm.loadingSlots'));
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [t]);

  // Функция для получения времени слота в минутах с начала дня
  const getTimeInMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isSlotAvailable = useCallback((timeSlot, slots) => {
    // Надежная проверка, что `slots` — это массив
    if (!Array.isArray(slots)) {
      return true;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Проверка на прошедшее время
    if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
      const [slotHours, slotMinutes] = timeSlot.split(':').map(Number);
      if (now.getHours() > slotHours || (now.getHours() === slotHours && now.getMinutes() >= slotMinutes)) {
        return false;
      }
    }

    const slotTimeMinutes = getTimeInMinutes(timeSlot);

    // Проверка забронированных слотов
    for (const slot of slots) {
      if ([BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED].includes(slot.status)) {
        const bookedTimeMinutes = getTimeInMinutes(slot.meeting_time);
        if (slotTimeMinutes === bookedTimeMinutes) {
          return false;
        }
      }
    }

    return true;
  }, [selectedDate]);

  // Новая функция для проверки доступности слота с актуальными данными с сервера
  const checkSlotAvailabilityFromServer = useCallback(async (timeSlot, date) => {
    if (!date) return true;

    const dateNoTimezone = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dateStr = dateNoTimezone.toISOString().split('T')[0];
    // Add seconds to match database format (HH:MM:SS)
    const timeSlotWithSeconds = timeSlot.includes(':') && timeSlot.split(':').length === 2
      ? `${timeSlot}:00`
      : timeSlot;

    try {
      const { data, error } = await supabase
        .from('leads')
        .eq('meeting_date', dateStr)
        .eq('meeting_time', timeSlotWithSeconds)
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED])
        .select('meeting_time, status, id, name');

      if (error) {
        return false; // В случае ошибки считаем слот недоступным
      }

      const isBooked = data && data.length > 0;
      return !isBooked;
    } catch (err) {
      return false; // В случае ошибки считаем слот недоступным
    }
  }, []);

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^7\d{10}$/.test(cleaned);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError(t('contactForm.errors.invalidName'));
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError(t('contactForm.errors.invalidPhone'));
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError(t('contactForm.errors.noDateOrTime'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dateNoTimezone = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
      const dateStr = dateNoTimezone.toISOString().split('T')[0];

      // Загружаем актуальные слоты и используем их для проверки
      const { data: currentSlotsData, error: fetchError } = await supabase
        .from('leads')
        .eq('meeting_date', dateStr)
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED])
        .order('meeting_time', { ascending: true })
        .select('meeting_time, status, id, name');

      if (fetchError) throw fetchError;

      const normalizedSlots = (currentSlotsData || []).map(slot => ({
        ...slot,
        meeting_time: slot.meeting_time.slice(0, 5)
      }));

      // Проверяем доступность слота локально
      const isAvailableLocally = isSlotAvailable(selectedTime, normalizedSlots);

      // Дополнительная проверка с сервера для надежности
      const isAvailableOnServer = await checkSlotAvailabilityFromServer(selectedTime, selectedDate);

      // Debug: Show which check failed
      if (!isAvailableLocally || !isAvailableOnServer) {
        const debugMsg = !isAvailableLocally
          ? '(Debug: Local check failed)'
          : '(Debug: Server check failed)';
        setError(`${t('contactForm.errors.slotUnavailable')} ${debugMsg}`);
        setLoading(false);
        return;
      }

      const cleanedPhone = formData.phone.replace(/\D/g, '');

      const bookingData = {
        name: formData.name.trim(),
        phone: cleanedPhone,
        meeting_date: dateStr,
        meeting_time: selectedTime,
        status: BOOKING_STATUSES.PENDING
      };

      const { data, error: insertError } = await supabase
        .from('leads')
        .insert([bookingData])
        .select();

      if (insertError) throw insertError;

      if (data && data[0]) {
        setBookingId(data[0].id);
        setBookingStatus(data[0].status);
      }

      // Telegram notification is sent from backend

      // Обновляем локальное состояние сразу
      const newBookedSlot = {
        meeting_time: selectedTime,
        status: BOOKING_STATUSES.PENDING,
        id: data[0]?.id,
        name: formData.name.trim()
      };
      setBookedSlots(prev => [...prev, newBookedSlot]);

      // Обновляем список забронированных слотов с сервера для синхронизации
      if (selectedDate) {
        await loadBookedSlots(selectedDate);
      }

      setFormStep(3);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('contactForm.errors.submissionError'));
    } finally {
      setLoading(false);
    }
  };

  const sendTelegramNotification = async (bookingData, recordId) => {
    const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return;
    }

    try {
      const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const message = `
New consultation request:

Name: ${bookingData.name}
Phone: +${bookingData.phone}
Date: ${formattedDate}
Time: ${bookingData.meeting_time}
Status: Pending approval

ID: ${recordId}
      `.trim();

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        }),
      });
    } catch (err) {
      console.error('Error sending Telegram notification:', err);
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '+7';
    if (cleaned.length > 1) formatted += ' ' + cleaned.substring(1, 4);
    if (cleaned.length > 4) formatted += ' ' + cleaned.substring(4, 7);
    if (cleaned.length > 7) formatted += ' ' + cleaned.substring(7, 9);
    if (cleaned.length > 9) formatted += ' ' + cleaned.substring(9, 11);
    return formatted.trim();
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const resetForm = () => {
    setFormStep(1);
    setFormData({ name: '', phone: '+7 ' });
    setSelectedDate(null);
    setSelectedTime(null);
    setError('');
    setBookingId(null);
    setBookingStatus(BOOKING_STATUSES.PENDING);
  };

  const checkBookingStatus = useCallback(async () => {
    if (!bookingId) return;
    try {
      const { data, error } = await supabase
        .from('leads')
        .eq('id', bookingId)
        .select('status')
        .single();

      if (error) throw error;
      if (data && data.status !== bookingStatus) {
        setBookingStatus(data.status);
      }
    } catch (err) {
      // Silently handle error
    }
  }, [bookingId, bookingStatus]);

  // GSAP Animations 
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
  }, []);

  // Animate confirmation screen
  useEffect(() => {
    if (formStep === 3 && confirmationRef.current) {
      gsap.fromTo(confirmationRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }
  }, [formStep]);

  useEffect(() => {
    if (selectedDate) {
      loadBookedSlots(selectedDate);
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, loadBookedSlots]);

  // Периодическое обновление данных о слотах
  useEffect(() => {
    if (!selectedDate) return;

    const interval = setInterval(() => {
      loadBookedSlots(selectedDate);
    }, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, [selectedDate, loadBookedSlots]);

  useEffect(() => {
    if (bookingId && formStep === 3) {
      const interval = setInterval(checkBookingStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [bookingId, formStep, checkBookingStatus]);


  return (
    <section id="contact" className="bg-[#49526F] py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden min-h-screen flex items-center">

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-[#F0CD4B]"
        >
          {t('contactForm.title')}
        </h1>
        <p

          className="text-lg md:text-xl text-[#F0CD4B] text-center mb-16 max-w-2xl mx-auto"
        >
          {t('contactForm.subtitle')}
        </p>

        {formStep === 3 ? (
          // Экран подтверждения
          <div
            ref={confirmationRef}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-[#F6EDCE] p-12 rounded-2xl border-2 border-[#49526F] shadow-xl">
              <div

                className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#F6EDCE] flex items-center justify-center"
              >
                {bookingStatus === BOOKING_STATUSES.CONFIRMED && <CheckCircle2 className="w-10 h-10 text-[#49526F]" />}
                {bookingStatus === BOOKING_STATUSES.PENDING && <CheckCircle2 className="w-10 h-10 text-[#49526F]" />}
                {bookingStatus === BOOKING_STATUSES.CANCELLED && <XCircle className="w-10 h-10 text-[#49526F]" />}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#49526F]">
                {bookingStatus === BOOKING_STATUSES.CONFIRMED ?
                t('contactForm.bookingConfirmed')
    : t('contactForm.requestSent')}
              </h2>

              <div className="space-y-6 mb-8">
              <p className="text-lg text-[#49526F]">
  {t('contactForm.receivedBooking')}
</p>
                <div className="bg-[#F6EDCE] border-2 border-[#49526F] rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#49526F]" />
                      <span className="font-semibold text-[#49526F]">
                        {selectedDate?.toLocaleDateString('ru-RU', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#49526F]" />
                      <span className="font-semibold text-[#49526F]">{selectedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[#49526F] mb-10">
  {bookingStatus === BOOKING_STATUSES.CONFIRMED
    ? t('contactForm.meetingConfirmed')
    : t('contactForm.managerContact')
  }
</p>

              <button
                onClick={resetForm}
                className="px-8 py-4 bg-[#49526F] border-2 border-[#F0CD4B] hover:bg-[#d94333] rounded-xl text-[#49526F] font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
  {t('contactForm.bookAnotherSlot')}
              </button>
            </div>
          </div>
        ) : (
          // Основная форма
          <div
            
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Левая колонка - выбор даты и времени */}
            <div

              className="bg-[#F6EDCE] p-8 rounded-2xl border-2 border-[#F0CD4B] shadow-lg h-fit"
            >
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-[#49526F]" />
<h3 className="text-2xl font-bold text-[#49526F]">{t('contactForm.selectDateTime')}</h3>
              </div>

              {/* Календарь для выбора даты */}
              <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#49526F] mb-6">{t('contactForm.availableDates')}</h4>

                {/* Заголовок календаря с навигацией */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg bg-[#F25340] text-[#49526F] hover:bg-[#d94333] transition-all duration-200 focus:outline-none"
                    aria-label={`Предыдущий месяц - ${monthNames[currentMonth.getMonth() - 1] || monthNames[11]} ${currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear()}`}
                    title="Перейти к предыдущему месяцу"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h3 className="text-xl font-bold text-[#49526F]" id="calendar-month-year" aria-live="polite">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>

                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg bg-[#F25340] text-[#49526F] hover:bg-[#d94333] transition-all duration-200 focus:outline-none"
                    aria-label={`Следующий месяц - ${monthNames[currentMonth.getMonth() + 1] || monthNames[0]} ${currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear()}`}
                    title="Перейти к следующему месяцу"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Дни недели */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-[#49526F] py-2 uppercase tracking-wide">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Календарная сетка */}
                <div className="grid grid-cols-7 gap-2">
                  {getCalendarDays().map((date, index) => {
                    const isAvailable = date && isDateAvailable(date);
                    const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();
                    const isToday = date && date.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={index}
                        className="aspect-square flex items-center justify-center"
                      >
                        {date ? (
                          <button

                            onClick={async () => {
                              if (isAvailable) {
                                setSelectedDate(date);
                                setSelectedTime(null);
                                setError('');
                                await loadBookedSlots(date);
                              }
                            }}
                            disabled={!isAvailable}
                            aria-label={`${date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}${isSelected ? ', выбрана' : ''}${!isAvailable ? ', недоступна' : ''}${isToday ? ', сегодня' : ''}`}
                            aria-pressed={isSelected}
                            aria-disabled={!isAvailable}
                            className={`w-full h-full rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center relative ${
                              isSelected
                                ? 'bg-[#F0CD4B] text-[#F25340] border-3 border-[#49526F] shadow-md'
                                : isAvailable
                                  ? 'bg-[#F0CD4B] text-[#49526F] border-2 border-[#49526F] border-opacity-30 hover:border-[#F25340] hover:border-opacity-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            }`}
                          >
                            {date.getDate()}
                            {isToday && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#F0CD4B] rounded-full" aria-hidden="true"></div>
                            )}
                          </button>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Легенда */}
                <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#F6EDCE] border-3 border-[#F25340] rounded-md"></div>
                    <span className="text-[#49526F]">{t('contactForm.legend.selected')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#F6EDCE] border-2 border-[#49526F] border-opacity-30 rounded-md"></div>
                    <span className="text-[#49526F]">{t('contactForm.legend.available')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 border-2 border-gray-200 rounded-md"></div>
                    <span className="text-[#49526F]">{t('contactForm.legend.unavailable')}</span>
                  </div>
                </div>
              </div>

              {/* Выбор времени */}
              <div>
              <h4 className="text-lg font-semibold text-[#49526F] mb-4">{t('contactForm.availableTimes')}</h4>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#F25340]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots
                        .filter((time) => isSlotAvailable(time, bookedSlots))
                        .map((time, index) => (
                        <button
                          key={time}

                          onClick={() => setSelectedTime(time)}
                          aria-label={`Время ${time}${selectedTime === time ? ', выбрано' : ''}`}
                          aria-pressed={selectedTime === time}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                            selectedTime === time
                              ? 'bg-[#F25340] text-[#49526F] border-[#F25340] shadow-md'
                              : 'bg-[#F6EDCE] text-[#49526F] border-[#49526F] border-opacity-30 hover:border-[#F25340] hover:border-opacity-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}

                    {timeSlots.filter((time) => isSlotAvailable(time, bookedSlots)).length === 0 && (
                      <div className="col-span-3 text-center py-6">
                        <Clock className="w-8 h-8 text-[#49526F] opacity-50 mx-auto mb-2" />
                        <p className="text-[#49526F]">{t('contactForm.noAvailableSlots')}</p>
                        {selectedDate && (
                          <p className="text-sm text-[#49526F] opacity-70 mt-1">{t('contactForm.chooseAnotherDate')}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Правая колонка - форма */}
            <div

              className="bg-[#F6EDCE] p-8 rounded-2xl border-2 border-[#F0CD4B] shadow-lg h-fit"
            >
              <div className="flex items-center gap-3 mb-8">
                <User className="w-6 h-6 text-[#49526F]" />
                <h3 className="text-2xl font-bold text-[#49526F]">{t('contactForm.yourInformation')}</h3>
              </div>

              <div className="space-y-6">
                <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-[#49526F] mb-2">
                  {t('contactForm.fullName')} *
                </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t('contactForm.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl border-2 bg-[#F6EDCE] text-[#49526F] placeholder-[#49526F]/40 focus:bg-[#F6EDCE] transition-all duration-200 focus:outline-none"
                    aria-required="true"
                    aria-describedby={error && error.includes('имя') ? 'name-error' : undefined}
                    aria-invalid={error && error.includes('имя') ? 'true' : 'false'}
                  />
                </div>

                <div>
                <label htmlFor="contact-phone" className="block text-sm font-semibold text-[#49526F] mb-2">
                  {t('contactForm.phoneNumber')} *
                </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+7 XXX XXX XX XX"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-4 rounded-xl border-2 border-[#49526F] border-opacity-30 bg-[#F6EDCE] text-[#49526F] placeholder-[#49526F]/40 focus:border-[#49526F] focus:bg-[#F6EDCE] transition-all duration-200 focus:outline-none"
                    aria-required="true"
                    aria-describedby={error && error.includes('телефон') ? 'phone-error' : 'phone-help'}
                    aria-invalid={error && error.includes('телефон') ? 'true' : 'false'}
                  />
                  <div id="phone-help" className="sr-only">
                    Введите номер телефона в формате +7 XXX XXX XX XX
                  </div>
                </div>

                {/* Отображение выбранных данных */}
                {(selectedDate || selectedTime) && (
                  <div

                    className="bg-[#F6EDCE] border-2 border-[#49526F] rounded-xl p-5"
                  >
<h4 className="text-sm font-semibold text-[#49526F] mb-3">{t('contactForm.selectedSlot')}</h4>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2 text-[#49526F]">
                        <Calendar className="w-4 h-4 text-[#49526F]" />
                        <span>{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#49526F]">
                        <Clock className="w-4 h-4 text-[#49526F]" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div
                  
                  className="mt-6 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-200"
                  role="alert"
                  aria-live="polite"
                  id={error.includes('имя') ? 'name-error' : error.includes('телефон') ? 'phone-error' : 'form-error'}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                aria-describedby="submit-help"
                className={`mt-8 w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none border-2
                  ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                    : 'bg-[#F25340] text-[#49526F] border-[#F25340] hover:bg-[#d94333] hover:border-[#d94333] shadow-md hover:shadow-lg'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
      {t('contactForm.submitting')}
    </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
      {t('contactForm.bookConsultation')}
    </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactFormSection;
