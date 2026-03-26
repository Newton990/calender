const CACHE_NAME = 'NewLuna-v1';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './register.html',
  './calendar.html',
  './settings.html',
  './pregnancy.html',
  './partner.html',
  './profile.html',
  './wellness.html',
  './report.html',
  './community.html',
  './style.css',
  './js/common.js',
  './js/auth.js',
  './js/dashboard.js',
  './js/settings.js',
  './js/pregnancy.js',
  './js/partner.js',
  './js/profile.js',
  './js/report.js',
  './js/community.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

