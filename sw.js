// ── DPE Prospection SQH — Service Worker PWA ──────────────────────
// Déposez ce fichier à la RACINE de votre repo GitHub (même niveau que le HTML)
// Il sera accessible à : https://fpsqh.github.io/FPDPEPRO/sw.js

const CACHE_NAME = 'sqh-dpe-v5';
const APP_URL    = '/FPDPEPRO/DPE_Prospection_SQH_v5_multi.html';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(APP_URL))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ne pas intercepter les requêtes Supabase
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Met en cache uniquement les réponses valides
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
