import { useState } from 'react';
import { supabase } from '../supabaseClient';
import CleaveInput from './CleaveInput';
import { useTranslation } from 'react-i18next';

function PhoneForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^7\d{10}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPhone = phone.replace(/\D/g, '');

    if (!validatePhone(phone)) {
      setError('Wrong number format');
      setSuccessMessage('');
      return;
    }

    const { error: insertError } = await supabase
      .from('leads')
      .insert([{ name: name.trim(), phone: cleanedPhone }]);

    if (insertError) {
      setError('Error! Try again later.');
      setSuccessMessage('');
    } else {
      const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      // Добавим простую проверку на случай, если переменная не установлена
      if (!TELEGRAM_BOT_TOKEN) {
        console.error("Ошибка конфигурации: Токен Telegram-бота не установлен в переменных окружения.");
        setError("Configuration error: Telegram Bot Token missing.");
        return;  
      }
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `📩 Новый лид:\n👤 Имя: ${name.trim()}\n📞 Телефон: ${cleanedPhone}`,
        }),
      });

      // Очистка формы
      setError(null);
      setSuccessMessage('Thank you! We will contact you shortly.');
      setName('');
      setPhone('+7 ');
    }
  };

  return (
    <div className="form-wrapper">
    <h3 className="form-title">{t('form.title')}</h3>
    <p className="form-subtitle">{t('form.subtitle')}</p>
  
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text"
        className="form-input"
        placeholder={t('form.namePlaceholder')}
        value={name}
        required
        onChange={(e) => {
          const value = e.target.value;
          const capitalized = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
          setName(capitalized);
        }}
      />
  
      <CleaveInput
        placeholder={t('form.phonePlaceholder')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="form-input"
        required
      />
  
      {error && <p className="form-error">{t('form.errors.' + error)}</p>}
  
      {successMessage ? (
        <>
          <p className="form-success">{t('form.success')}</p>
          <button
            type="button"
            className="form-button"
            onClick={() => {
              setSuccessMessage('');
              setError(null);
            }}
          >
            {t('form.sendAnother')}
          </button>
        </>
      ) : (
        <>
          <p className="form-note">{t('form.note')}</p>
          <button type="submit" className="form-button">{t('form.send')}</button>
        </>
      )}
    </form>
  </div>
  );
}

export default PhoneForm;