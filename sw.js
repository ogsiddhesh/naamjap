// A name for our cache
const CACHE_NAME = 'jap-counter-v2'; // Updated version

// List of files to cache
const urlsToCache = [
    '/',
    'index.html',
    'shreeram.html',
    'contact.html',
    'manifest.json',
    'https://cdn.tailwindcss.com'
];

// Install event: This is triggered when the service worker is first installed.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Add all the files to the cache
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: This is triggered for every network request.
self.addEventListener('fetch', event => {
    // We handle ad scripts differently - always fetch them from network
    // This is important so your ads always work.
    if (event.request.url.includes('monetag') || event.request.url.includes('propellerads')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the request is in the cache, return it from the cache
                if (response) {
                    return response;
                }

                // If the request is not in the cache, fetch it from the network
                return fetch(event.request);
            })
    );
});

// Activate event: This is used to clean up old caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});