// Service Worker for Oil Intel — GitHub Pages sub-path aware
const CACHE = 'oil-intel-v4';
const BASE  = '/Market_updates'; // GitHub Pages repo sub-path

const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Skip cross-origin requests (API calls, TradingView etc.)
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Network first, fall back to cache for app shell
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
