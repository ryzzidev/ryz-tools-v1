const CACHE_NAME = 'ryz-tools-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'https://files.catbox.moe/w0jf8q.png',
  'https://files.catbox.moe/tery5s.png',
  'https://files.catbox.moe/70xerl.png',
  'https://files.catbox.moe/5a1g2l.mp4',
  'https://files.catbox.moe/nvrqlv.mp4'
];

// Install Service Worker dan simpan aset ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivasi Service Worker dan bersihkan cache lama jika ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategi Cache: Coba ambil dari jaringan dulu, jika offline ambil dari cache
self.addEventListener('fetch', (event) => {
  // Lewati request non-http/https (seperti ekstensi browser)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika berhasil mendapatkan respon terbaru, kloning dan simpan ke cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika gagal koneksi (offline), ambil dari cache lokal
        return caches.match(event.request);
      })
  );
});
