import { useCallback, useEffect, useState } from "react";

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeBanner, setActiveBanner] = useState<"none" | "generic" | "ios">("none");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone == true;

    // Android / Chrome prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      if (isIOS) return;
      
      e.preventDefault();
      setDeferredPrompt(e);

      if (!sessionStorage.getItem("pwa_banner_dismissed")) {
        setActiveBanner("generic");
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // IOS instructions
    if (isIOS && !isStandalone && !sessionStorage.getItem("ios_banner_dismissed")) {
      setActiveBanner("ios");
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(console.error);
      });
    }
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice();

    if (outcome === "accepted") setActiveBanner("none");
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setActiveBanner("none");
    sessionStorage.setItem("pwa_banner_dismissed", "true");
  }, []);

  const dismissIOS = useCallback(() => {
    setActiveBanner("none");
    sessionStorage.setItem("ios_banner_dismissed", "true");
  }, []);

  return {
    showBanner: activeBanner === "generic",
    showIOSBanner: activeBanner === "ios",
    install,
    dismiss,
    dismissIOS
  };
}
