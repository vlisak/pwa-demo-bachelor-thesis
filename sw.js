const version = "staticv1-0-7";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(version).then(cache => {
      return cache.addAll(["./", "./icon_145.png", "./app.js", "./style.css"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response =>{
      return response || fetch(e.request);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== version)
        .map(key => caches.delete(key))
      );
    })
  );
});
