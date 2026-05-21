/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const ssrHandler = new NetworkFirst({
  cacheName: "pages-cache"
});

registerRoute(new NavigationRoute(ssrHandler));

// Push notification listeners
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || "🍽️ Menus updated!";
    const options = {
      body: payload.body || "Check out today's new menus.",
      icon: "/pwa-192x192.png",
      badge: "/pwa-64x64.png",
      data: {
        url: payload.url || "/"
      }
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error displaying push notification:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(self.clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then((windowClients) => {
    for (const client of windowClients) {
      if (client.url === urlToOpen && "focus" in client) return client.focus();
    }

    if (self.clients.openWindow) return self.clients.openWindow(urlToOpen);
  }));
});
