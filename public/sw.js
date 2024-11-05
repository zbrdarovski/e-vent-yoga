const CACHE_NAME = 'v1_static_resources';
const STATIC_RESOURCES = [
    // Dodajanje virov, ki bodo na voljo offline
    '/index.html',
    '/js/shrani.js',
    '/stil.css',
    '/slike/joga1.jpg',
    '/slike/joga2.jpg',
    '/slike/icons/yoga-fotor-172x172.png',
    '/slike/icons/yoga-fotor-192x192.png',
    '/slike/icons/yoga-fotor-72x72.png',
];

// Dogodek install - predpomnenje statičnih virov
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Predpomnjenje statičnih virov!');
                return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, {credentials: 'same-origin'})));
            })
    );
});

// Dogodek fetch - poskusi najprej pridobiti iz predpomnilnika, sicer pošlji zahtevo na omrežje
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
          // Vrne odgovor iz predpomnilnika, če je na voljo
          return response || fetch(event.request).catch(function() {
              // Če omrežna zahteva ne uspe, vnremo index.html iz predpomnilnika
              return caches.match('/index.html');
          });
      })
  );
});