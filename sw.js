const CACHE_NAME = 'zerra-app-shell-v1.2.0';
const APP_SHELL = [
  './', './index.html', './manifest.json', './dist/bundle.css', './dist/script.js',
  './libraries/alpine.js', './imgs/logo.svg', './imgs/logo-192x192.png',
  './imgs/logo-256x256.png', './imgs/logo-384x384.png', './imgs/logo-512x512.png',
  './imgs/zerra-home-hero.jpg', './imgs/save-seeds-practice.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation and app code are network-first. This prevents a successfully
  // installed older shell from continuing to serve stale HTML/JS/CSS after an
  // update, while retaining the current cache as an offline fallback.
  const isAppCode = request.mode === 'navigate' || /\.(?:html|js|css|json)$/i.test(url.pathname);
  if (isAppCode) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            const key = request.mode === 'navigate' ? './index.html' : request;
            cache.put(key, copy);
          });
        }
        return response;
      }).catch(async () => {
        if (request.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
        return (await caches.match(request)) || Response.error();
      })
    );
    return;
  }

  // Static media remains cache-first for fast/offline rendering, with a
  // background refresh so changed images can update without blocking the UI.
  event.respondWith(caches.match(request).then(cached => {
    const refresh = fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => null);
    if (cached) {
      event.waitUntil(refresh);
      return cached;
    }
    return refresh.then(response => response || Response.error());
  }));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
