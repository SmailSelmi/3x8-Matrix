// public/sw.js
const CACHE_NAME = 'trois-huit-v3';
const PRE_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use individual adds so a single 404 never aborts the whole SW install
      await Promise.allSettled(
        PRE_CACHE.map((url) => cache.add(url).catch((err) => {
          console.warn('[SW] Failed to cache:', url, err);
        }))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// ─── Web Push: handle incoming push message from server ──────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'Trois Huit', body: 'لديك إشعار جديد.' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'broadcast',
    renotify: true,
    dir: 'rtl',
    lang: 'ar',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ─── Notification click: focus or open the app ───────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('notificationclose', (_event) => {
  // Handle notification close if needed
});
