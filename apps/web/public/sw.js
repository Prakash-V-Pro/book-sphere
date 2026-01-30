self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("booksphere-static-v1").then((cache) => {
      return cache.addAll(["/", "/manifest.json"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open("booksphere-static-v1").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});

