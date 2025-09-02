// netlify/functions/create-calendar-event.js
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

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

    if (newRecord.status !== 'confirmed') {
      console.log('Booking status is not confirmed, no action needed.');
      return { statusCode: 200, body: 'Status not confirmed' };
    }

    console.log('Processing confirmed booking:', newRecord);

    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const calendarEvent = {
      summary: `Бронирование от: ${newRecord.name}`,
      description: `Телефон: ${newRecord.phone}\nID бронирования: ${newRecord.id}`,
      start: {
        dateTime: `${newRecord.meeting_date}T${newRecord.meeting_time}:00`,
        timeZone: 'Asia/Almaty',
      },
      end: {
        dateTime: new Date(new Date(`${newRecord.meeting_date}T${newRecord.meeting_time}:00`).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'Asia/Almaty',
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: calendarEvent,
    });

    console.log('Event created:', response.data.htmlLink);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event created successfully!', link: response.data.htmlLink }),
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create event', details: error.message }),
    };
  }
};