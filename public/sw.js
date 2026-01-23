const cacheName = 'social-network-v2';

const urlsToCache = [
    '/',
    '/css/app.css',
    '/js/app.js',
    '/socials.png',
    '/mobile-social.png',
    '/manifest.json'
];


self.addEventListener('install', async event => {
   const cash = await caches.open(cacheName);
   await cash.addAll(urlsToCache)
});


self.addEventListener('activate', async event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== cacheName) {
              return caches.delete(cache);
            }
          })
        );
      })
    );
  });





  self.addEventListener('fetch', event => {

    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {

            return response;
          }

          return fetch(event.request);
        })
    );
  });