/* MyDiet - service worker minimo: l'app funziona anche senza rete */
const CACHE = "mydiet-v1";
const FILE = ["./", "./index.html", "./manifest.webmanifest", "./icona-180.png", "./icona-192.png", "./icona-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); return r; })
              .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
