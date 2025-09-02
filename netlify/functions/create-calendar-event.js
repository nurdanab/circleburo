// netlify/functions/create-calendar-event.js
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const calendarId = process.env.G_CAL_ID;
const serviceAccountKey = JSON.parse(process.env.G_CAL_SERVICE_ACCOUNT_KEY);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];


function safeBuildDateTime(dateStr, timeStr) {
  console.log("Raw meeting_date:", dateStr);
  console.log("Raw meeting_time:", timeStr);

  if (!dateStr || !timeStr) {
    throw new Error(`Missing date or time. date=${dateStr}, time=${timeStr}`);
  }

  const isoString = `${dateStr}T${timeStr}:00+06:00`; // Алматы = UTC+6
  const dt = new Date(isoString);

  if (isNaN(dt.getTime())) {
    throw new Error(`Invalid datetime format: ${isoString}`);
  }

  return dt;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    console.log('📌 Incoming booking record:', newRecord);

    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    if (newRecord.status === 'cancelled' && oldRecord?.status !== 'cancelled' && oldRecord?.calendar_event_id) {
      console.log('Booking cancelled. Deleting event...');

      try {
        await calendar.events.delete({
          calendarId,
          eventId: oldRecord.calendar_event_id,
        });
      } catch (err) {
        console.warn('Event already deleted from calendar:', err.message);
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

      const startDate = safeBuildDateTime(newRecord.meeting_date, newRecord.meeting_time);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час

      const calendarEvent = {
        summary: `Клиент: ${newRecord.name}`,
        description: `Телефон: ${newRecord.phone}${notesContent}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Asia/Almaty',
        },
        end: {
          dateTime: endDate.toISOString(),
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
            console.log('Event updated:', response.data.htmlLink);
          } else {
            console.log('Event already up to date, no changes needed.');
          }
        } catch (err) {
          console.warn('⚠️ Event not found in calendar, creating new one...');
          const response = await calendar.events.insert({
            calendarId,
            resource: calendarEvent,
          });

          console.log('Event recreated:', response.data.htmlLink);

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
        const response = await calendar.events.insert({
          calendarId,
          resource: calendarEvent,
        });

        console.log('Event created:', response.data.htmlLink);

        const { error } = await supabase
          .from('leads')
          .update({ calendar_event_id: response.data.id })
          .eq('id', newRecord.id);

        if (error) {
          console.error('⚠️ Failed to save calendar_event_id:', error);
          throw new Error('Event created but not linked to booking');
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
    console.error('Error handling calendar event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to handle event',
        details: error.message,
      }),
    };
  }
};
