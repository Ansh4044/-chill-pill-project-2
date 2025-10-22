const CACHE_DB = 'ChillPillCache-v1';
const CACHEABLE_TYPES = ['audio/mpeg', 'audio/mp3'];

// Install event: create cache
self.addEventListener('install', e => {
  self.skipWaiting();
  console.log('🎧 SW installed');
});

// Fetch event: intercept audio requests
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Only cache Supabase songs
  if (url.includes('/storage/v1/object/public/songs/')) {
    e.respondWith(
      caches.open(CACHE_DB).then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) {
          console.log('🎶 Loaded from SW cache:', url);
          return cached;
        }

        try {
          const response = await fetch(e.request);
          if (response.ok && CACHEABLE_TYPES.some(t => response.headers.get('Content-Type')?.includes(t))) {
            cache.put(e.request, response.clone());
            console.log('🎵 Cached via SW:', url);
          }
          return response;
        } catch (err) {
          console.error('❌ Fetch failed:', url, err);
          return cached || Response.error();
        }
      })
    );
  }
});
