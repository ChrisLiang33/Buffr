const CACHE_NAME = "buffr-v1.0.0";
const STATIC_CACHE = "buffr-static-v1.0.0";
const DYNAMIC_CACHE = "buffr-dynamic-v1.0.0";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css",
  // Add other static assets here
];

const staticAssets = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Opened static cache");
        return cache.addAll(staticAssets);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests differently
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === "GET") {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // For other requests, try network first
  event.respondWith(fetch(request));
});

async function handleStaticRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache the response for future use
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, return offline page
    return caches.match("/offline.html");
  }
}

async function handleApiRequest(request) {
  try {
    // Try network first for API requests
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // For API requests, try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return error response for API requests
    return new Response(
      JSON.stringify({ error: "Network error, please try again later" }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener("push", (event) => {
  const options = {
    body: event.data
      ? event.data.text()
      : "You have a new notification from Buffr",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/icon-72x72.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-72x72.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Buffr", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  return new Promise((resolve) => {
    // Check for pending transactions or actions
    // This would typically involve checking IndexedDB for pending operations
    console.log("Background sync triggered");
    resolve();
  });
}

// Message handling for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "SYNC_OFFLINE_DATA") {
    event.waitUntil(doBackgroundSync());
  }
});
