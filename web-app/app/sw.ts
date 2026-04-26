import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const ssrHandler = new NetworkFirst({
  cacheName: "pages-cache"
});

registerRoute(new NavigationRoute(ssrHandler));
