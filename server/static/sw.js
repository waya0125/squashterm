const cacheName = "squashterm-v1";
const staticAssets = [
  "/",
  "/static/styles.css",
  "/static/app.js",
  "/static/images/logo.png",
  "/static/images/icon.png",
  "/static/manifest.webmanifest",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(staticAssets)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  // /media/ と /api/ は常にネットワークから取得（キャッシュしない）
  if (url.pathname.startsWith("/media/") || url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseClone = response.clone();
        caches.open(cacheName).then((cache) => cache.put(event.request, responseClone));
        return response;
      });
    })
  );
});
