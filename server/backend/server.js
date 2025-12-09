const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const logger = require('./utils/logger');
const calendarService = require('./services/calendar');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
  logger.info('Database connected successfully');
});

// Middleware
app.use(helmet());

// CORS configuration - allow requests from frontend
const allowedOrigins = [
  'https://circleburo.kz',
  'https://www.circleburo.kz',
  'https://circleburo.netlify.app', // Netlify deployment
  'http://localhost:5173', // for local development
  'http://localhost:3000'
];

// Add CORS_ORIGIN from environment if set
if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  envOrigins.forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

logger.info('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow any origin if CORS_ORIGIN is set to '*'
    if (process.env.CORS_ORIGIN === '*') return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      logger.info(`CORS: Allowing origin ${origin}`);
      callback(null, true);
    } else {
      logger.warn(`CORS: Blocking origin ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rate limiting - increased limits for development and admin panel usage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased from 100)
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// ==================== API ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all leads (with optional filters)
app.get('/api/leads', async (req, res) => {
  try {
    const { meeting_date, status } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (meeting_date) {
      query += ` AND meeting_date = $${paramCount}`;
      params.push(meeting_date);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get single lead by ID
app.get('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Create new lead
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, meeting_date, meeting_time, status = 'pending' } = req.body;

    // Validation
    if (!name || !phone || !meeting_date || !meeting_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if slot is available
    const existingSlot = await pool.query(
      `SELECT id FROM leads
       WHERE meeting_date = $1
       AND meeting_time = $2
       AND status IN ('pending', 'confirmed')`,
      [meeting_date, meeting_time]
    );

    if (existingSlot.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    // Insert new lead
    const result = await pool.query(
      `INSERT INTO leads (name, phone, meeting_date, meeting_time, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, phone, meeting_date, meeting_time, status]
    );

    const newLead = result.rows[0];
    logger.info(`New lead created: ${newLead.id}`);

    // Send Telegram notification
    await sendTelegramNotification(newLead);

    res.status(201).json(newLead);
  } catch (error) {
    logger.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update lead
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get old record before update
    const oldResult = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const oldRecord = oldResult.rows[0];

    // Build update query dynamically
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `UPDATE leads SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    const updatedLead = result.rows[0];

    logger.info(`Lead updated: ${id}`, { updates });

    // Handle Google Calendar sync if status changed
    if (updates.status && updates.status !== oldRecord.status) {
      await calendarService.handleStatusChange(oldRecord, updatedLead);
    }

    res.json(updatedLead);
  } catch (error) {
    logger.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get lead before deletion
    const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const lead = leadResult.rows[0];

    // Delete from database
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);

    // Delete calendar event if exists
    if (lead.calendar_event_id) {
      await calendarService.deleteEvent(lead.calendar_event_id);
    }

    logger.info(`Lead deleted: ${id}`);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    logger.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Telegram notification helper
async function sendTelegramNotification(lead) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    logger.warn('Telegram credentials not configured');
    return;
  }

  try {
    const message = `
New consultation request:

Name: ${lead.name}
Phone: +${lead.phone}
Date: ${lead.meeting_date}
Time: ${lead.meeting_time}
Status: ${lead.status}

ID: ${lead.id}
    `.trim();

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });
  } catch (error) {
    logger.error('Error sending Telegram notification:', error);
  }
}

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});
