// netlify/functions/log-error.js
// Функция для логирования фронтенд ошибок

exports.handler = async (event) => {
  console.log('Error logging function started');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const errorData = JSON.parse(event.body);
    
    // Validate required fields
    if (!errorData.error || !errorData.url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: error, url' })
      };
    }

    // Enhanced logging with structured data
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      source: 'frontend',
      error: errorData.error,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      url: errorData.url,
      userAgent: errorData.userAgent,
      userId: errorData.userId,
      sessionId: errorData.sessionId,
      retryCount: errorData.retryCount || 0,
      viewport: errorData.viewport,
      connection: errorData.connection,
      buildId: process.env.COMMIT_REF || 'unknown',
      environment: process.env.CONTEXT || 'unknown'
    };

    // Log to console with structured format (Netlify captures these)
    console.error('Frontend Error Report:', JSON.stringify(logEntry, null, 2));

    // Send to Telegram for immediate notifications
    await sendTelegramNotification(logEntry);

    // TODO: Add integration with external logging services
    // - Sentry
    // - LogRocket
    // - Datadog
    // - Custom webhook

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Error logged successfully',
        id: generateErrorId(logEntry)
      }),
    };

  } catch (error) {
    console.error('❌ Error in log-error function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to log error',
        details: error.message
      }),
    };
  }
};

async function sendTelegramNotification(logEntry) {
  const TELEGRAM_BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured for error reporting');
    return;
  }

  try {
    const message = `
🚨 <b>Frontend Error Alert</b>

<b>Error:</b> ${logEntry.error}
<b>URL:</b> ${logEntry.url}
<b>User:</b> ${logEntry.userId} (${logEntry.sessionId})
<b>Retry Count:</b> ${logEntry.retryCount}
<b>Environment:</b> ${logEntry.environment}
<b>Build:</b> ${logEntry.buildId}
<b>Time:</b> ${logEntry.timestamp}

<b>Browser:</b> ${logEntry.userAgent?.substring(0, 100)}
<b>Viewport:</b> ${logEntry.viewport?.width}x${logEntry.viewport?.height}
${logEntry.connection ? `<b>Connection:</b> ${logEntry.connection.effectiveType} (${logEntry.connection.downlink}Mbps)` : ''}

<b>Component Stack:</b>
<code>${logEntry.componentStack?.split('\n').slice(0, 3).join('\n')}</code>
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    console.log('✅ Error notification sent to Telegram');
  } catch (err) {
    console.error('❌ Failed to send Telegram notification:', err);
  }
}

function generateErrorId(logEntry) {
  // Generate a simple hash for error identification
  const errorString = logEntry.error + logEntry.url + logEntry.componentStack;
  let hash = 0;
  for (let i = 0; i < errorString.length; i++) {
    const char = errorString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}