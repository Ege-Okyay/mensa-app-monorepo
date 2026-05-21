import { useCallback, useEffect, useState } from "react";
import { pushApi } from '../api/push';

/**
 * Converts the VAPID public key to browsers desired format
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function usePushNotifications(vapidPublicKey: string) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const hasSupport = 
        typeof window !== "undefined" && 
        "serviceWorker" in navigator && 
        "PushManager" in window;

      if (!hasSupport) return;

      setIsSupported(true);
      setPermission(Notification.permission);

      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      } catch (err) {
        console.error("Failed to get push subscription:", err);
      }
    };

    checkSupport();
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;

    setLoading(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        throw new Error("Notification permission not granted");
      }

      const registration = await navigator.serviceWorker.ready;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      const reqBody = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("auth")!)))
        },
        locale: navigator.language
      };

      await pushApi.subscribe(reqBody);
      setSubscription(sub);

    } catch (err) {
      console.error("Error subscribing to push notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [isSupported, vapidPublicKey]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    setLoading(true);

    try {
      await subscription.unsubscribe();

      await pushApi.unsubscribe({
        endpoint: subscription.endpoint
      });

      setSubscription(null);
    } catch (err) {
      console.error("Error unsubscribing from push notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    isSubscribed: !!subscription,
    subscribe,
    unsubscribe,
    loading
  };
}
