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

  static getDerivedStateFromError(error) {
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
    // Отправка в Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        custom_map: {
          error_info: errorInfo.componentStack
        }
      });
    }

    // Отправка в New Relic (если доступен)
    if (typeof newrelic !== 'undefined') {
      newrelic.noticeError(error, {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount
      });
    }

    // Отправка в собственную систему мониторинга
    if (import.meta.env.PROD) {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          retryCount: this.state.retryCount
        })
      }).catch(() => {
        // Игнорируем ошибки отправки
      });
    }
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
