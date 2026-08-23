// ============================================
// LIFELINK – Service Worker
// Offline-First Caching Strategy for PWA
// ============================================

const CACHE_NAME = 'lifelink-v5';
const STATIC_CACHE = 'lifelink-static-v5';
const DYNAMIC_CACHE = 'lifelink-dynamic-v5';

// Core files to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/search.html',
  '/emergency.html',
  '/hospitals.html',
  '/blood-banks.html',
  '/about.html',
  '/contact.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/profile.html',
  '/request-history.html',
  '/faq.html',
  '/admin.html',
  '/offline.html',
  '/css/main.css',
  '/css/dashboard.css',
  '/css/admin.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/data.js',
  '/js/config.js',
  '/js/donors.js',
  '/js/emergency.js',
  '/js/maps.js',
  '/js/admin.js',
  '/js/firebase-config.js',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

// External CDN resources to cache
const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// ---- INSTALL: Pre-cache all static assets ----
self.addEventListener('install', (event) => {
  console.log('[SW] Installing LifeLink Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching static assets...');
        // Cache local assets (don't fail install if some miss)
        const localPromise = cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[SW] Some static assets failed to cache:', err);
        });
        // Cache CDN assets separately (best-effort)
        const cdnPromise = Promise.all(
          CDN_ASSETS.map(url =>
            cache.add(url).catch(err =>
              console.warn(`[SW] Failed to cache CDN: ${url}`, err)
            )
          )
        );
        return Promise.all([localPromise, cdnPromise]);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// ---- ACTIVATE: Clean old caches ----
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating LifeLink Service Worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim()) // Take control of all pages
  );
});

// ---- FETCH: Stale-while-revalidate for pages, cache-first for assets ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Firebase/API requests (always go to network)
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') && url.pathname.includes('/v1/') ||
      url.hostname.includes('firestore.googleapis.com')) {
    return;
  }

  // Strategy 1: Cache-first for static assets (CSS, JS, images, fonts)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        });
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
    );
    return;
  }

  // Strategy 2: Network-first for HTML pages (stale-while-revalidate)
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the fresh page
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Try cache, then offline page
          return caches.match(request).then(cached => {
            return cached || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Strategy 3: Network-first with cache fallback for everything else
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ---- Helper: Check if URL is a static asset ----
function isStaticAsset(url) {
  const extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return extensions.some(ext => url.pathname.endsWith(ext)) ||
         url.hostname === 'unpkg.com' ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

// ---- PUSH NOTIFICATIONS (for future use) ----
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LifeLink';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-512x512.png',
    badge: '/icons/icon-512x512.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/index.html'
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ---- NOTIFICATION CLICK ----
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Focus existing tab if available
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ---- BACKGROUND SYNC (for future use) ----
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-emergency-requests') {
    console.log('[SW] Syncing emergency requests...');
    // Future: sync queued emergency requests when back online
  }
});

console.log('[SW] LifeLink Service Worker loaded.');
