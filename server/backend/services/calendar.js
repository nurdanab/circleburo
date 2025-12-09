const { google } = require('googleapis');
const logger = require('../utils/logger');

let auth = null;
let calendar = null;

// Initialize Google Calendar client
function initializeCalendar() {
  if (!process.env.G_CAL_SERVICE_ACCOUNT_KEY || !process.env.G_CAL_ID) {
    logger.warn('Google Calendar not configured');
    return false;
  }

  try {
    const serviceAccountKey = JSON.parse(process.env.G_CAL_SERVICE_ACCOUNT_KEY);

    auth = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    calendar = google.calendar({ version: 'v3', auth });
    logger.info('Google Calendar initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Google Calendar:', error);
    return false;
  }
}

// Handle status change
async function handleStatusChange(oldRecord, newRecord) {
  if (!initializeCalendar()) return;

  const calendarId = process.env.G_CAL_ID;

  try {
    // If cancelled, delete event
    if (newRecord.status === 'cancelled' && oldRecord.status !== 'cancelled') {
      if (oldRecord.calendar_event_id) {
        await deleteEvent(oldRecord.calendar_event_id);
        logger.info(`Calendar event deleted for lead ${newRecord.id}`);
      }
      return;
    }

    // If confirmed, create or update event
    if (newRecord.status === 'confirmed') {
      const startDateTime = `${newRecord.meeting_date}T${newRecord.meeting_time}`;
      const endTime = addOneHour(newRecord.meeting_time);
      const endDateTime = `${newRecord.meeting_date}T${endTime}`;

      const eventData = {
        summary: `Клиент: ${newRecord.name}`,
        description: `Телефон: ${newRecord.phone}${newRecord.notes ? '\nЗаметки: ' + newRecord.notes : ''}`,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Almaty'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Almaty'
        }
      };

      if (newRecord.calendar_event_id) {
        // Update existing event
        await calendar.events.update({
          calendarId,
          eventId: newRecord.calendar_event_id,
          resource: eventData
        });
        logger.info(`Calendar event updated for lead ${newRecord.id}`);
      } else {
        // Create new event
        const response = await calendar.events.insert({
          calendarId,
          resource: eventData
        });

        // Update database with calendar event ID
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        await pool.query(
          'UPDATE leads SET calendar_event_id = $1 WHERE id = $2',
          [response.data.id, newRecord.id]
        );
        await pool.end();

        logger.info(`Calendar event created for lead ${newRecord.id}`);
      }
    }
  } catch (error) {
    logger.error('Error handling calendar event:', error);
    throw error;
  }
}

// Delete calendar event
async function deleteEvent(eventId) {
  if (!initializeCalendar()) return;

  try {
    await calendar.events.delete({
      calendarId: process.env.G_CAL_ID,
      eventId: eventId
    });
    logger.info(`Calendar event ${eventId} deleted`);
  } catch (error) {
    if (error.code === 404) {
      logger.warn(`Calendar event ${eventId} not found (already deleted)`);
    } else {
      logger.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

// Helper: Add one hour to time string
function addOneHour(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const newHours = (parseInt(hours) + 1).toString().padStart(2, '0');
  return `${newHours}:${minutes}`;
}

module.exports = {
  handleStatusChange,
  deleteEvent
};
