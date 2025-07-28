// Service Worker for RADIUS PWA
const CACHE_NAME = 'radius-v4-' + Date.now();
const urlsToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/auth.js',
  '/js/router.js',
  '/js/config.js',
  '/pages/login.js',
  '/pages/dashboard.js',
  '/pages/profile.js',
  '/pages/reports.js',
  '/pages/user-profile.js',
  '/pages/circle-leader.js',
  '/pages/org-settings.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// External resources that may not support CORS for caching
const externalUrls = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Only cache local resources initially
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Try to cache external resources separately with error handling
        return caches.open(CACHE_NAME).then(cache => {
          return Promise.allSettled(
            externalUrls.map(url => 
              fetch(url, { mode: 'no-cors' })
                .then(response => cache.put(url, response))
                .catch(err => console.log(`Failed to cache ${url}:`, err))
            )
          );
        });
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For external resources, try fetch with fallback
        const isExternal = event.request.url.startsWith('https://cdn.') || 
                          event.request.url.includes('supabase');
        
        return fetch(event.request).then(networkResponse => {
          // Ensure we have a valid response
          if (!networkResponse) {
            throw new Error('Network response is null');
          }
          
          // Only cache local resources or successful external responses
          if (!isExternal && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.log('Fetch failed:', error);
          // Fallback for offline scenarios
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          // For external resources that fail, return a basic response to prevent errors
          if (isExternal) {
            return new Response('', { status: 200, statusText: 'OK' });
          }
          // For other failed requests, return a generic error response
          return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
        });
      })
      .catch(error => {
        console.log('Cache match failed:', error);
        // If cache matching fails, try direct fetch
        return fetch(event.request).catch(() => {
          return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
