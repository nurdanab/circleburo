// Service Worker для Circle Buro
const CACHE_NAME = 'circle-buro-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Критические ресурсы для кэширования
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/favicon.ico',
  '/img/favicon-32x32.png',
  '/img/favicon-16x16.png',
  '/img/apple-touch-icon.png',
  '/fonts/Montserrat-Regular.woff2',
  '/fonts/Montserrat-Bold.woff2',
  '/fonts/Montserrat-Light.woff2'
];

// Стратегии кэширования
const CACHE_STRATEGIES = {
  // Критические ресурсы - Cache First
  critical: [
    '/',
    '/index.html',
    '/manifest.json',
    '/img/favicon',
    '/fonts/'
  ],
  
  // API запросы - Network First
  api: [
    '/api/',
    '/netlify/functions/'
  ],
  
  // Статические ресурсы - Stale While Revalidate
  static: [
    '/assets/',
    '/img/',
    '/videos/'
  ]
};

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // Пропускаем chrome-extension и другие протоколы
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Пропускаем внешние домены, которые могут конфликтовать с CSP
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'api.telegram.org',
    'www.googleapis.com',
    'accounts.google.com'
  ];

  if (externalDomains.some(domain => url.hostname.includes(domain))) {
    return; // Не кэшируем внешние ресурсы
  }

  event.respondWith(handleRequest(request));
});

// Стратегии кэширования
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Критические ресурсы - Cache First
    if (isCriticalResource(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // API запросы - Network First
    if (isApiRequest(pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Статические ресурсы - Stale While Revalidate
    if (isStaticResource(pathname)) {
      return await staleWhileRevalidate(request, STATIC_CACHE);
    }
    
    // Остальные запросы - Network First
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Fallback для HTML страниц
    if (request.headers.get('accept').includes('text/html')) {
      return await caches.match('/index.html');
    }
    
    throw error;
  }
}

// Cache First стратегия
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    // Кэшируем только полные ответы (избегаем partial responses 206)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    throw error;
  }
}

// Network First стратегия
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Кэшируем только полные ответы (избегаем partial responses 206)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    console.error('[SW] Network First failed:', error);
    throw error;
  }
}

// Stale While Revalidate стратегия
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  // Асинхронное обновление кэша в фоне
  const updateCache = async () => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok && networkResponse.status === 200) {
        const cache = await caches.open(cacheName);
        await cache.put(request, networkResponse.clone());
      }
    } catch (error) {
      console.warn('[SW] Background update failed:', error);
    }
  };

  // Если есть кэшированная версия, возвращаем её и обновляем в фоне
  if (cachedResponse) {
    updateCache(); // Не ждём завершения
    return cachedResponse;
  }

  // Если нет кэшированной версии, делаем сетевой запрос
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Если сеть недоступна, возвращаем кэшированную версию (если есть)
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Проверка типа ресурса
function isCriticalResource(pathname) {
  return CACHE_STRATEGIES.critical.some(pattern => pathname.includes(pattern));
}

function isApiRequest(pathname) {
  return CACHE_STRATEGIES.api.some(pattern => pathname.includes(pattern));
}

function isStaticResource(pathname) {
  return CACHE_STRATEGIES.static.some(pattern => pathname.includes(pattern));
}

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/img/favicon-192x192.png',
      badge: '/img/favicon-96x96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Открыть сайт',
          icon: '/img/favicon-32x32.png'
        },
        {
          action: 'close',
          title: 'Закрыть',
          icon: '/img/favicon-32x32.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Периодическая очистка кэша
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

