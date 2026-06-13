const CACHE_NAME = 'valia-cache-v1';
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];
const NON_CRITICAL_ASSETS = [];

// Instalar Service Worker y pre-cachear solo recursos críticos iniciales (App Shell)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-cacheando recursos críticos de App Shell');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker y limpiar cachés antiguas, luego iniciar descarga progresiva
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
    }).then(() => {
      self.clients.claim();
      // Descargar recursos secundarios (chunks de calculadoras) en segundo plano
      cacheNonCriticalAssets();
    })
  );
});

// Función para pre-cargar recursos secundarios progresivamente sin bloquear el registro
async function cacheNonCriticalAssets() {
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log(`SW: Iniciando pre-carga de ${NON_CRITICAL_ASSETS.length} recursos secundarios en segundo plano...`);
    
    // Descargar cada recurso de forma individual e ignorar fallos para no interrumpir el flujo
    for (const url of NON_CRITICAL_ASSETS) {
      try {
        const cached = await cache.match(url);
        if (!cached) {
          const response = await fetch(url);
          if (response.status === 200) {
            await cache.put(url, response);
            console.log(`SW: Recurso secundario pre-cargado con éxito: ${url}`);
          }
        }
      } catch (err) {
        console.warn(`SW: No se pudo pre-cargar recurso secundario en segundo plano: ${url}`, err);
      }
    }
    console.log('SW: Pre-carga de recursos secundarios finalizada con éxito.');
  } catch (err) {
    console.error('SW: Error en proceso de pre-carga asíncrona:', err);
  }
}

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
