'use strict';

// Cache-Version – bei Änderungen hochzählen → erzwingt Update
const CACHE = 'wm2026-v1';

// Alle statischen Assets die beim Install gecacht werden
const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/logo.png',
  '/manifest.webmanifest',
  'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css',
];

// Install: alle Assets vorab cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch-Strategie:
// - API-Calls (worldcup26.ir) → immer Network-First, kein Caching
// - flag-icons CDN → Cache-First (ändert sich nie bei fixierter Version)
// - alle lokalen Assets → Cache-First mit Network-Fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API immer frisch holen
  if (url.hostname === 'worldcup26.ir') {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Alle anderen: Cache-First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // Nur erfolgreiche GET-Requests cachen
        if (event.request.method !== 'GET' || !resp || resp.status !== 200 || resp.type === 'opaque') {
          return resp;
        }
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return resp;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
