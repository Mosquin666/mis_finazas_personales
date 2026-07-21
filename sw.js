const CACHE_NAME = 'mis-finanzas-v1';
const ARCHIVOS = [
  '/mis_finazas_personales/',
  '/mis_finazas_personales/index.html',
  '/mis_finazas_personales/manifest.json',
  '/mis_finazas_personales/icon.png'
];

// Instalar — guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// Activar — limpia cachés viejos si actualizas la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — sirve desde caché, con internet como respaldo
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('/mis_finazas_personales/index.html'))
  );
});
