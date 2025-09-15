import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError() {
    // Обновляем состояние для отображения fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логируем ошибку
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Отправляем ошибку в систему мониторинга
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // Enhanced error data
    const errorData = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
      userId: localStorage.getItem('userId') || 'anonymous',
      sessionId: sessionStorage.getItem('sessionId') || 'unknown',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };

    // Отправка в Google Analytics
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        custom_map: {
          error_component: errorInfo.componentStack.split('\n')[1] || 'unknown',
          retry_count: this.state.retryCount,
          user_agent: navigator.userAgent.substring(0, 100)
        }
      });
    }

    // Отправка в New Relic (если доступен)
    if (typeof window !== 'undefined' && typeof window.newrelic !== 'undefined') {
      window.newrelic.noticeError(error, errorData);
    }

    // Отправка в Netlify Functions для логирования
    if (import.meta.env.PROD) {
      fetch('/.netlify/functions/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      }).catch((fetchError) => {
        // Fallback - отправка в Telegram
        this.reportToTelegram(errorData, fetchError);
      });
    } else {
      // В разработке выводим в консоль
      console.group('🚨 Error Boundary Report');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.table(errorData);
      console.groupEnd();
    }
  };

  reportToTelegram = (errorData, fetchError = null) => {
    const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `
🚨 Frontend Error Alert

Error: ${errorData.error}
URL: ${errorData.url}
Retry Count: ${errorData.retryCount}
User Agent: ${errorData.userAgent.substring(0, 100)}
Time: ${errorData.timestamp}

${fetchError ? `\nFallback triggered due to: ${fetchError.message}` : ''}
    `.trim();

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    }).catch(() => {
      // Последний fallback - сохранение в localStorage
      const errors = JSON.parse(localStorage.getItem('unsentErrors') || '[]');
      errors.push({ ...errorData, timestamp: Date.now() });
      localStorage.setItem('unsentErrors', JSON.stringify(errors.slice(-10))); // Keep only last 10
    });
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Что-то пошло не так</h1>
              <p className="text-gray-400 mb-6">
                Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
                disabled={this.state.retryCount >= 3}
              >
                {this.state.retryCount >= 3 ? 'Превышено количество попыток' : 'Попробовать снова'}
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Перезагрузить страницу
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-transparent border border-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                На главную
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
                  Детали ошибки (только в разработке)
                </summary>
                <div className="mt-2 p-4 bg-gray-900 rounded text-xs overflow-auto max-h-64">
                  <div className="mb-2">
                    <strong>Ошибка:</strong>
                    <pre className="whitespace-pre-wrap text-red-400">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  <div className="mb-2">
                    <strong>Stack trace:</strong>
                    <pre className="whitespace-pre-wrap text-gray-300">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  <div>
                    <strong>Component stack:</strong>
                    <pre className="whitespace-pre-wrap text-gray-300">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="mt-8 text-xs text-gray-500">
              <p>Если проблема повторяется, свяжитесь с нами:</p>
              <p className="mt-1">
                <a href="mailto:info@circleburo.kz" className="text-yellow-400 hover:text-yellow-300">
                  info@circleburo.kz
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
