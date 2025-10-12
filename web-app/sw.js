// sw.js - Service Worker para GymApp
const CACHE_NAME = 'gymapp-v1.1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icon-96x96.png',
  './icon-144x144.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './entrenamiento/index.html'
];

// Instalar y cachear los archivos iniciales
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Error en cache.addAll:', error);
      })
  );
  self.skipWaiting();
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', event => {
  console.log('Service Worker activando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Estrategia: Cache First para assets, Network First para HTML
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Para archivos HTML, usa Network First
  if (request.url.includes('.html') || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Guardar en caché para próximas visitas
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback al caché
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si es navegación y no hay caché, mostrar offline
              if (request.mode === 'navigate') {
                return caches.match('./offline.html');
              }
            });
        })
    );
  } 
  // Para otros recursos (CSS, JS, imágenes), usa Cache First
  else {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then(response => {
              // Guardar en caché para próxima vez
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
              return response;
            })
            .catch(error => {
              console.log('Error fetching:', error);
            });
        })
    );
  }
});