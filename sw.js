/* sw.js — Kill switch Service Worker
   Ce fichier doit être déployé à la racine du repo GitHub.
   Il désinstalle tous les SW actifs (notamment l'ancien blob URL SW)
   et ne fait RIEN D'AUTRE : pas de cache, pas d'interception de fetch. */

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(keys.map(function(k) { return caches.delete(k); }));
      })
      .then(function() {
        return self.registration.unregister();
      })
      .then(function() {
        return self.clients.matchAll({ type: 'window' });
      })
      .then(function(clients) {
        clients.forEach(function(client) {
          if (client.navigate) client.navigate(client.url);
        });
      })
  );
});

// N'intercepte AUCUNE requête fetch — pas de respondWith
