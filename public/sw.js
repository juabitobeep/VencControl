const CACHE_NAME = 'venccontrol-v1';

// Instalar service worker
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Interceptar notificaciones push
self.addEventListener('push', (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'VencControl 📦', {
      body: data.body || 'Tenés productos que requieren atención',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'venccontrol-alert',
      renotify: true,
      requireInteraction: false,
    })
  );
});

// Click en notificación → abrir la app
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
