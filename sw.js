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
      } catch {
        // ignore cache deletion errors
      }
      try {
        await self.clients.claim();
      } catch {
        // ignore client claim errors
      }
      try {
        await self.registration.unregister();
      } catch {
        // ignore unregister errors
      }
    })()
  );
});

self.addEventListener('fetch', (_event) => {
  // Do not intercept any requests
  return;
});

