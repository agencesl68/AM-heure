/* AM Environnement — service worker notifications (Web Push VAPID standard, sans SDK tiers) */

self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e){ data = { body: event.data ? event.data.text() : "" }; }

  // Titre court : iOS ajoute deja « de AM Environnement » en dessous,
  // inutile de repeter le nom ici.
  var titre = data.title || "Rappel";
  var options = {
    body: data.body || "N'oublie pas de remplir ta feuille d'heures",
    icon: "/AM-heure/icon.png",
    badge: "/AM-heure/icon.png",
    tag: "am-rappel",
    renotify: true,
    data: { url: data.url || "/AM-heure/" }
  };
  event.waitUntil(self.registration.showNotification(titre, options));
});

self.addEventListener("notificationclick", function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "/AM-heure/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        if (list[i].url.indexOf("/AM-heure/") !== -1 && "focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
