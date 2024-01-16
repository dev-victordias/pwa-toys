'use strict';

const STATIC_CACHE = "brinquedo-app-estatico";

const FILES_TO_CACHE = [
    'css/bootstrap.min.css',
    'css/styles.css',
    'icons/152.png',
    'imgs/logo.png',
    'imgs/bg001.jpg',
    'imgs/bg002.jpg',
    'imgs/cat_icon.jpg',
    'imgs/offline.png',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'offline.html'
];

//Instalando Service Worker
self.addEventListener('install', (evt) => {

    console.log("Installing Service Worker");

    evt.waitUntil(

        caches.open(STATIC_CACHE).then((cache) => {

            console.log("Service Worker is adding static cache");
            return cache.addAll(FILES_TO_CACHE);

        })

    );

    self.skipWaiting();

});

//Ativando Service Worker
self.addEventListener('activate', (evt) => {

    console.log("Activating Service Worker");

    evt.waitUntil(

        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {

                if(key !== STATIC_CACHE) {
                    return caches.delete(key);
                }

            }));
        })

    );

    self.clients.claim();

});

//Responder página offline
self.addEventListener('fetch', (evt) => {

    if(evt.request.mode !== 'navigate') {
        return;
    }

    evt.respondWith(
        fetch(evt.request).catch(() => {

            return caches.open(STATIC_CACHE).then((cache) => {

                return cache.match('offline.html');

            });

        })
    );

});