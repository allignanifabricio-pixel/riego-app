self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('push', event => {
  event.waitUntil(
    self.registration.showNotification('💧 Riego del día', {
      body: 'Revisá qué árboles tenés que regar hoy 🌳',
      icon: 'icon.png'
    })
  );
});