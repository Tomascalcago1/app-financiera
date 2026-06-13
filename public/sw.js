const CACHE_NAME = 'valia-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Instalar Service Worker y pre-cachear recursos críticos iniciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-cacheando recursos críticos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker y limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Limpiando caché antigua', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones y aplicar estrategia de caché Stale-While-Revalidate
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Solo interceptar peticiones locales del mismo dominio y peticiones GET
  if (requestUrl.origin === self.location.origin && event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Servir desde caché inmediatamente, actualizar en segundo plano si hay red
          fetch(event.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* Ignorar errores de red en segundo plano */});
          
          return cachedResponse;
        }

        // Si no está en caché, ir a la red, y si tiene éxito, guardar en caché
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(err => {
          // Si falla la red y es navegación, retornar el fallback del index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          throw err;
        });
      })
    );
  }
});
