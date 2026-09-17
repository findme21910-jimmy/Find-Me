/* =========================================================
   FIND ME - SERVICE WORKER
   ========================================================= */

const CACHE_NAME = "find-me-v6";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

/* =========================================================
   INSTALACIÓN
   ========================================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log(
                    "Find Me: guardando archivos..."
                );

                return cache.addAll(
                    FILES_TO_CACHE
                );
            })
            .catch(error => {

                console.error(
                    "Find Me: error al guardar archivos:",
                    error
                );

            })
    );

    self.skipWaiting();
});


/* =========================================================
   ACTIVACIÓN
   ========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        if (
                            cacheName !== CACHE_NAME
                        ) {

                            console.log(
                                "Find Me: eliminando caché antigua:",
                                cacheName
                            );

                            return caches.delete(
                                cacheName
                            );
                        }

                        return null;
                    })
                );
            })
            .then(() => {

                console.log(
                    "Find Me: Service Worker activado."
                );

                return self.clients.claim();
            })
    );
});


/* =========================================================
   PETICIONES
   ========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    /* Solo manejar peticiones GET */
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    /*
       Archivos principales de la aplicación.
       Se intenta obtener primero la versión actual
       desde Internet.
    */

    const archivosPrincipales = [
        "index.html",
        "style.css",
        "app.js",
        "manifest.json"
    ];

    const nombreArchivo =
        url.pathname.split("/").pop();

    const esArchivoPrincipal =
        archivosPrincipales.includes(
            nombreArchivo
        );


    /* =====================================================
       ARCHIVOS PRINCIPALES
       ===================================================== */

    if (esArchivoPrincipal) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })

            .then(response => {

                if (
                    response &&
                    response.ok
                ) {

                    const copia =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                request,
                                copia
                            );

                        })
                        .catch(error => {

                            console.error(
                                "Find Me: error actualizando caché:",
                                error
                            );

                        });
                }

                return response;
            })

            .catch(() => {

                return caches.match(request);
            })
        );

        return;
    }


    /* =====================================================
       ICONOS Y OTROS ARCHIVOS
       ===================================================== */

    event.respondWith(

        caches.match(request)

            .then(response => {

                if (response) {
                    return response;
                }

                return fetch(request);
            })

            .catch(error => {

                console.error(
                    "Find Me: error en petición:",
                    error
                );

                throw error;
            })
    );
});