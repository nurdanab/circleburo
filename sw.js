// SW Kill-Switch: clear caches and unregister
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch (_) {}
      try {
        await self.clients.claim();
      } catch (_) {}
      try {
        await self.registration.unregister();
      } catch (_) {}
    })()
  );
});

self.addEventListener('fetch', (event) => {
  // Do not intercept any requests
  return;
});

