// netlify/functions/create-calendar-event.js
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const calendarId = process.env.G_CAL_ID;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Добавляем проверку переменных окружения
function validateEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'G_CAL_ID',
    'G_CAL_SERVICE_ACCOUNT_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

function getServiceAccountKey() {
  try {
    return JSON.parse(process.env.G_CAL_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error('Failed to parse G_CAL_SERVICE_ACCOUNT_KEY:', error);
    throw new Error('Invalid service account key JSON format');
  }
}

function safeBuildDateTime(dateStr, timeStr) {
    console.log("Raw meeting_date:", dateStr);
    console.log("Raw meeting_time:", timeStr);
  
    if (!dateStr || !timeStr) {
      throw new Error(`Missing date or time. date=${dateStr}, time=${timeStr}`);
    }
  
    // Создаём строку в формате ISO 8601 без временной зоны.
    // timeStr уже содержит секунды (например "12:00:00").
    const isoString = `${dateStr}T${timeStr}`;
  
    // Проверяем, является ли это валидной датой.
    if (isNaN(new Date(isoString).getTime())) {
      throw new Error(`Invalid datetime format: ${isoString}`);
    }
  
    console.log("Parsed datetime:", isoString);
    return isoString;
  }

exports.handler = async (event) => {
  console.log('🔥 Function started');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Проверяем переменные окружения
    validateEnvironment();

    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' })
      };
    }

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    console.log('📌 Incoming booking record:', newRecord);

    // Получаем ключ сервисного аккаунта
    const serviceAccountKey = getServiceAccountKey();

    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Проверяем подключение к Google Calendar
    try {
      await auth.authorize();
      console.log('✅ Successfully authenticated with Google Calendar');
    } catch (authError) {
      console.error('❌ Google Calendar authentication failed:', authError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Google Calendar authentication failed',
          details: authError.message
        })
      };
    }

    if (newRecord.status === 'cancelled' && oldRecord?.status !== 'cancelled' && oldRecord?.calendar_event_id) {
      console.log('Booking cancelled. Deleting event...');

      try {
        await calendar.events.delete({
          calendarId,
          eventId: oldRecord.calendar_event_id,
        });
        console.log('✅ Event deleted successfully');
      } catch (err) {
        console.warn('⚠️ Event already deleted from calendar:', err.message);
      }

      const { error } = await supabase
        .from('leads')
        .update({ calendar_event_id: null })
        .eq('id', newRecord.id);

      if (error) {
        console.error('Failed to clear calendar_event_id in DB:', error);
        throw new Error('Event deleted, but database update failed');
      }

      return { statusCode: 200, body: 'Event deleted' };
    }

    if (newRecord.status === 'confirmed') {
      const notesContent = newRecord.notes ? `\nЗаметки: ${newRecord.notes}` : '';

      let startDateStr, endDateStr;
      try {
        startDateStr = safeBuildDateTime(newRecord.meeting_date, newRecord.meeting_time);

        // Используем объект Date только для вычисления endDate
        const startDate = new Date(startDateStr);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час
        endDateStr = endDate.toISOString();

      } catch (dateError) {
        console.error('Date parsing error:', dateError);
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Invalid date/time format',
            details: dateError.message
          })
        };
      }

      const calendarEvent = {
        summary: `Клиент: ${newRecord.name}`,
        description: `Телефон: ${newRecord.phone}${notesContent}`,
        start: {
          dateTime: startDateStr,
          timeZone: 'Asia/Almaty',
        },
        end: {
          dateTime: endDateStr,
          timeZone: 'Asia/Almaty',
        },
      };

      if (newRecord.calendar_event_id) {
        try {
          console.log('Checking existing event in Google Calendar...');
          const existingEvent = await calendar.events.get({
            calendarId,
            eventId: newRecord.calendar_event_id,
          });

          const gEvent = existingEvent.data;

          // Проверяем различия
          const needUpdate =
            gEvent.summary !== calendarEvent.summary ||
            gEvent.description !== calendarEvent.description ||
            gEvent.start.dateTime !== calendarEvent.start.dateTime ||
            gEvent.end.dateTime !== calendarEvent.end.dateTime;

          if (needUpdate) {
            console.log('Updating event to sync with Supabase...');
            const response = await calendar.events.update({
              calendarId,
              eventId: newRecord.calendar_event_id,
              resource: calendarEvent,
            });
            console.log('✅ Event updated:', response.data.htmlLink);
          } else {
            console.log('Event already up to date, no changes needed.');
          }
        } catch (err) {
          console.warn('⚠️ Event not found in calendar, creating new one...', err.message);
          const response = await calendar.events.insert({
            calendarId,
            resource: calendarEvent,
          });

          console.log('✅ Event recreated:', response.data.htmlLink);

          const { error } = await supabase
            .from('leads')
            .update({ calendar_event_id: response.data.id })
            .eq('id', newRecord.id);

          if (error) {
            console.error('⚠️ Failed to update calendar_event_id in DB:', error);
            throw new Error('Event recreated but not linked to booking');
          }
        }

      // === Если события ещё нет ===
      } else {
        console.log('✨ Creating new event...');
        try {
          const response = await calendar.events.insert({
            calendarId,
            resource: calendarEvent,
          });

          console.log('✅ Event created:', response.data.htmlLink);

          const { error } = await supabase
            .from('leads')
            .update({ calendar_event_id: response.data.id })
            .eq('id', newRecord.id);

          if (error) {
            console.error('⚠️ Failed to save calendar_event_id:', error);
            throw new Error('Event created but not linked to booking');
          }
        } catch (createError) {
          console.error('❌ Failed to create calendar event:', createError);
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: 'Failed to create calendar event',
              details: createError.message
            })
          };
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event handled and synced successfully!' }),
      };
    }

    console.log('Booking status not relevant, skipping...');
    return { statusCode: 200, body: 'No action needed' };

  } catch (error) {
    console.error('❌ Error handling calendar event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to handle event',
        details: error.message,
        stack: error.stack
      }),
    };
  }
};