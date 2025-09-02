// netlify/functions/create-calendar-event.js
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');

// Создаем клиент Supabase для обновления данных
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const calendarId = process.env.G_CAL_ID;
const serviceAccountKey = JSON.parse(process.env.G_CAL_SERVICE_ACCOUNT_KEY);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    console.log('Processing booking:', newRecord);

    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Обработка отмененного статуса
    // Если статус изменился на "cancelled" и у нас есть ID события
    if (newRecord.status === 'cancelled' && oldRecord.status !== 'cancelled' && oldRecord.calendar_event_id) {
      console.log('Booking cancelled. Deleting event...');
      await calendar.events.delete({
        calendarId: calendarId,
        eventId: oldRecord.calendar_event_id,
      });

      // Также очищаем ID события в базе данных
      await supabase
        .from('leads')
        .update({ calendar_event_id: null })
        .eq('id', newRecord.id);

      return { statusCode: 200, body: 'Event deleted' };
    }

    // Обработка подтвержденного статуса
    if (newRecord.status === 'confirmed') {
      const notesContent = newRecord.notes ? `\nЗаметки: ${newRecord.notes}` : '';

      const calendarEvent = {
        summary: `Клиент: ${newRecord.name}`,
        description: `Телефон: ${newRecord.phone}\n${notesContent}`,
        start: {
          dateTime: `${newRecord.meeting_date}T${newRecord.meeting_time}`,
          timeZone: 'Asia/Almaty',
        },
        end: {
          dateTime: new Date(new Date(`${newRecord.meeting_date}T${newRecord.meeting_time}`).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'Asia/Almaty',
        },
      };

      // Проверяем, есть ли уже ID события в базе
      if (newRecord.calendar_event_id) {
        // Если есть, обновляем существующее событие
        console.log('Event already exists. Updating it...');
        const response = await calendar.events.update({
          calendarId: calendarId,
          eventId: newRecord.calendar_event_id,
          resource: calendarEvent,
        });
        console.log('Event updated:', response.data.htmlLink);
      } else {
        // Если нет, создаем новое событие
        console.log('Creating a new event...');
        const response = await calendar.events.insert({
          calendarId: calendarId,
          resource: calendarEvent,
        });

        console.log('Event created:', response.data.htmlLink);

        // Сохраняем ID созданного события в базу данных
        await supabase
          .from('leads')
          .update({ calendar_event_id: response.data.id })
          .eq('id', newRecord.id);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event handled successfully!' }),
      };
    }

    // Если статус не "confirmed" и не "cancelled"
    console.log('Booking status is not confirmed or cancelled, no action needed.');
    return { statusCode: 200, body: 'Status not relevant' };

  } catch (error) {
    console.error('Error handling calendar event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to handle event', details: error.message }),
    };
  }
};