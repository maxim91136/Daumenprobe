/* Offline-Hülle: gleiche Herkunft zuerst aus dem Netz (damit Updates sofort da sind), sonst aus dem Speicher. Messdaten laufen nie darüber. */
const CACHE = 'daumenprobe-shell';
const SHELL = ['./', 'index.html', 'style.css', 'logic.js', 'app.js', 'fonts/bricolage.woff2', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    const copy = r.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));
});
