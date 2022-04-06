const staticCache = 'site-static-v4';
const dynamicCache = 'site-dynamic-v4';
const staticAssets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    '/pages/404.html',
    '/manifest.json',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            cache.addAll(staticAssets)
        })
    )
});
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => {
                        return key !== staticCache && key !== dynamicCache
                    })
                    .map(key => caches.delete(key))
            )
        })
    )
});
self.addEventListener("fetch", (event) => {
    if (event.request.url.indexOf(`firestore.googleapis.com`) === -1) {
        event.respondWith(
            caches.match(event.request).then(cacheMatch => {
                return cacheMatch || fetch(event.request).then(response => {
                    // handle response yang di dapat dari server, untuk kebutuhan dynamic cache
                    return caches.open(dynamicCache).then(cache => {
                        // kenapa response.clone() karena reponse yang di dapat dari server hanya
                        // bisa di pakai 1x. jika ingin di gunakan lebih dari 1x, harus di clone
                        cache.put(event.request.url, response.clone())

                        limitCacheSize(dynamicCache, '10')

                        return response
                    })
                }).catch(() => {
                    if (event.request.url.indexOf('.html') > -1) {
                        return caches.match('/pages/404.html')
                    }
                })
            })
        )
    }
});