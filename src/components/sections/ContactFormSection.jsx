import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Check, X, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useTranslation } from 'react-i18next';

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

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Генерируем звёздочки для фона
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleDelay: Math.random() * 4,
  }));

  // Генерируем светящиеся кружочки
  const glowDots = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 30,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 8 + 10,
    opacity: Math.random() * 0.08 + 0.03,
  }));

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
        .select('meeting_time, status, id, name')
        .eq('meeting_date', dateStr)
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED])
        .order('meeting_time', { ascending: true });

      if (error) throw error;

      const normalized = (data || []).map(slot => ({
        ...slot,
        meeting_time: slot.meeting_time.slice(0,5)
      }));

      setBookedSlots(normalized);
      
    } catch (err) {
      console.error('Error loading booked slots:', err);
      setError(t('contactForm.loadingSlots'));
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Функция для получения времени слота в минутах с начала дня
  const getTimeInMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isSlotAvailable = useCallback((timeSlot, slots) => {
    // Надежная проверка, что `slots` — это массив
    if (!Array.isArray(slots)) {
      console.warn('isSlotAvailable was called without a valid slots array.');
      return true;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
      const [slotHours, slotMinutes] = timeSlot.split(':').map(Number);
      if (now.getHours() > slotHours || (now.getHours() === slotHours && now.getMinutes() >= slotMinutes)) {
        return false;
      }
    }

    const slotTimeMinutes = getTimeInMinutes(timeSlot);

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

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('meeting_time, status, id, name')
        .eq('meeting_date', dateStr)
        .eq('meeting_time', timeSlot)
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED]);

      if (error) {
        console.error('Error checking slot availability:', error);
        return false; // В случае ошибки считаем слот недоступным
      }

      const isBooked = data && data.length > 0;
      return !isBooked;
    } catch (err) {
      console.error('Error in checkSlotAvailabilityFromServer:', err);
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
        .select('meeting_time, status, id, name')
        .eq('meeting_date', dateStr) 
        .in('status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED])
        .order('meeting_time', { ascending: true });

      if (fetchError) throw fetchError;
      
      const normalizedSlots = (currentSlotsData || []).map(slot => ({
        ...slot,
        meeting_time: slot.meeting_time.slice(0, 5)
      }));

      // Проверяем доступность слота локально
      const isAvailableLocally = isSlotAvailable(selectedTime, normalizedSlots);

      // Дополнительная проверка с сервера для надежности
      const isAvailableOnServer = await checkSlotAvailabilityFromServer(selectedTime, selectedDate);

      if (!isAvailableLocally || !isAvailableOnServer) {
        setError(t('contactForm.errors.slotUnavailable'));
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

      await sendTelegramNotification(bookingData, data[0]?.id);

      // Обновляем локальное состояние сразу
      const newBookedSlot = {
        meeting_time: selectedTime,
        status: BOOKING_STATUSES.PENDING,
        id: data[0]?.id,
        name: formData.name.trim()
      };
      setBookedSlots(prev => [...prev, newBookedSlot]);

      // Обновляем список забронированных слотов с сервера
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
    setBookedSlots([]);
    setError('');
    setBookingId(null);
    setBookingStatus(BOOKING_STATUSES.PENDING);
  };

  const checkBookingStatus = useCallback(async () => {
    if (!bookingId) return;
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('status')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      if (data && data.status !== bookingStatus) {
        setBookingStatus(data.status);
      }
    } catch (err) {
      console.error('Error checking booking status:', err);
    }
  }, [bookingId, bookingStatus]);

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

  useEffect(() => {
    if (bookingStatus === BOOKING_STATUSES.CONFIRMED) {
      console.log('Your booking has been confirmed!');
    }
    if (bookingStatus === BOOKING_STATUSES.CANCELLED) {
      console.log('Your booking has been cancelled.');
    }
  }, [bookingStatus]);

  return (
    <section id="contact" className="bg-black text-white py-20 px-6 md:px-20 relative overflow-hidden min-h-screen flex items-center">
      {/* Анимированные звёздочки на фоне */}
      <motion.div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: star.opacity }}
            transition={{ duration: 0.6, delay: star.delay }}
          >
            <motion.div
              className="bg-white rounded-full"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
              }}
              animate={{
                opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: star.twinkleDelay,
              }}
            />
          </motion.div>
        ))}

        {/* Большие светящиеся кружочки */}
        {glowDots.map((dot) => (
          <motion.div
            key={`glow-${dot.id}`}
            className="absolute rounded-full"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 30%, transparent 70%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: dot.delay }}
          >
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 60%)',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [dot.opacity, dot.opacity * 1.5, dot.opacity],
              }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Фоновые градиенты */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-white/8 via-white/4 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-radial from-white/6 via-white/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-white/3 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Заголовок секции */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t('contactForm.title')}
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t('contactForm.subtitle')}
        </motion.p>

        {formStep === 3 ? (
          // Экран подтверждения
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-12 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-sm">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {bookingStatus === BOOKING_STATUSES.CONFIRMED && <CheckCircle2 className="w-10 h-10 text-white" />}
                {bookingStatus === BOOKING_STATUSES.PENDING && <CheckCircle2 className="w-10 h-10 text-white" />}
                {bookingStatus === BOOKING_STATUSES.CANCELLED && <XCircle className="w-10 h-10 text-white" />}
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {bookingStatus === BOOKING_STATUSES.CONFIRMED ? 
                t('contactForm.bookingConfirmed') 
    : t('contactForm.requestSent')}
              </h3>
              
              <div className="space-y-4 mb-8 text-gray-300">
              <p className="text-lg">
  {t('contactForm.receivedBooking')}
</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white" />
                      <span className="font-semibold">
                        {selectedDate?.toLocaleDateString('ru-RU', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-white" />
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                  </div>
                </div>
                
                
              </div>
              
              <p className="text-gray-400 mb-8">
  {bookingStatus === BOOKING_STATUSES.CONFIRMED 
    ? t('contactForm.meetingConfirmed')
    : t('contactForm.managerContact')
  }
</p>
              
              <motion.button
                onClick={resetForm}
                className="px-8 py-4 bg-gradient-to-r from-white/8 to-white/4 hover:from-white/15 hover:to-white/10 border border-white/15 hover:border-white/30 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
  {t('contactForm.bookAnotherSlot')}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Основная форма
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Левая колонка - выбор даты и времени */}
            <motion.div 
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm h-fit"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-white" />
<h3 className="text-2xl font-bold text-white">{t('contactForm.selectDateTime')}</h3>
              </div>

              {/* Календарь для выбора даты */}
              <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-300 mb-4">{t('contactForm.availableDates')}</h4>
                
                {/* Заголовок календаря с навигацией */}
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  
                  <h3 className="text-xl font-bold text-white">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  
                  <motion.button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>

                {/* Дни недели */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2 uppercase tracking-wide">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Календарная сетка */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, index) => {
                    const isAvailable = date && isDateAvailable(date);
                    const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();
                    const isToday = date && date.toDateString() === new Date().toDateString();

                    return (
                      <motion.div
                        key={index}
                        className="aspect-square flex items-center justify-center"
                      >
                        {date ? (
                          <motion.button
                            onClick={async () => {
                              if (isAvailable) {
                                setSelectedDate(date);
                                setSelectedTime(null);
                                setError('');
                                await loadBookedSlots(date);
                              }
                            }}
                            disabled={!isAvailable}
                            className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center relative ${
                              isSelected
                                ? 'bg-gradient-to-r from-white to-gray-100 text-black shadow-lg shadow-white/20'
                                : isAvailable
                                  ? 'bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/40 hover:shadow-md'
                                  : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.01 }}
                            whileHover={isAvailable ? { scale: 1.05, y: -1 } : {}}
                            whileTap={isAvailable ? { scale: 0.95 } : {}}
                          >
                            {date.getDate()}
                            {isToday && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                            )}
                          </motion.button>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Легенда */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-100 rounded-full"></div>
                    <span className="text-gray-400">{t('contactForm.legend.selected')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/5 border border-white/20 rounded-full"></div>
                    <span className="text-gray-400">{t('contactForm.legend.available')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/5 border border-white/10 rounded-full opacity-50"></div>
                    <span className="text-gray-400">{t('contactForm.legend.unavailable')}</span>
                  </div>
                </div>
              </div>

              {/* Выбор времени */}
              <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">{t('contactForm.availableTimes')}</h4>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots
                        .filter((time) => isSlotAvailable(time, bookedSlots))
                        .map((time, index) => (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-3 rounded-xl border font-semibold transition-all duration-300 ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-white to-gray-100 text-black border-white shadow-lg shadow-white/20'
                              : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40 hover:shadow-md'
                          }`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {time}
                        </motion.button>
                      ))}

                    {timeSlots.filter((time) => isSlotAvailable(time, bookedSlots)).length === 0 && (
                      <div className="col-span-3 text-center py-6">
                        <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">{t('contactForm.noAvailableSlots')}</p>
                        {selectedDate && (
                          <p className="text-sm text-gray-500 mt-1">{t('contactForm.chooseAnotherDate')}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Правая колонка - форма */}
            <motion.div 
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm h-fit"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-white" />
                <h3 className="text-2xl font-bold text-white">{t('contactForm.yourInformation')}</h3>
              </div>

              <div className="space-y-6">
                <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
  {t('contactForm.fullName')} *
</label>
                  <motion.input
                    type="text"
                    placeholder={t('contactForm.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-500 focus:border-white/40 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
  {t('contactForm.phoneNumber')} *
</label>
                  <motion.input
                    type="tel"
                    placeholder="+7 XXX XXX XX XX"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-500 focus:border-white/40 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                {/* Отображение выбранных данных */}
                {(selectedDate || selectedTime) && (
                  <motion.div 
                    className="bg-white/5 border border-white/10 rounded-2xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
<h4 className="text-sm font-semibold text-gray-300 mb-3">{t('contactForm.selectedSlot')}</h4>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-200">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-200">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 flex items-center gap-2 p-3 bg-red-900/40 text-red-300 rounded-xl border border-red-700/50"
                >
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className={`mt-8 w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${loading 
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-white to-gray-200 text-black shadow-lg hover:shadow-xl hover:scale-101'
                  }`}
                whileHover={!loading ? { scale: 1.01, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
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
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ContactFormSection;