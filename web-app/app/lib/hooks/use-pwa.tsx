import { useCallback, useEffect, useState } from "react";

export function usePWA() {
  const [activeBanner, setActiveBanner] = useState<"none" | "android" | "ios">("none");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone == true;

    if (!isStandalone) {
      if (isAndroid && !sessionStorage.getItem("android_banner_dismissed")) {
        setActiveBanner("android");
      } else if (isIOS && !sessionStorage.getItem("ios_banner_dismissed")) {
        setActiveBanner("ios");
      }
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js", { type: "module" }).catch(console.error);
    }
  }, []);

  const showInstallGuide = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) setActiveBanner("ios");
    else if (isAndroid) setActiveBanner("android");
  }, []);

  const dismiss = useCallback(() => {
    setActiveBanner("none");
    sessionStorage.setItem("android_banner_dismissed", "true");
  }, []);

  const dismissIOS = useCallback(() => {
    setActiveBanner("none");
    sessionStorage.setItem("ios_banner_dismissed", "true");
  }, []);

  return {
    showAndroidBanner: activeBanner === "android",
    showIOSBanner: activeBanner === "ios",
    showInstallGuide,
    dismiss,
    dismissIOS
  };
}
