import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { LanguageProvider, useTranslation } from "./lib/contexts/language-context";
import Header from "./components/header";
import SplashScreen from "./components/splash-screen";
import { usePWA } from "./lib/hooks/use-pwa";
import IOSInstallBanner from "./components/ios-install-banner";
import { useEffect, useState } from "react";
import AndroidInstallBanner from "./components/android-install-banner";
import { isApiError } from "./lib/api/client";
import { ErrorView } from "./components/error-view";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="light" translate="no">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#E83939" />
        <meta name="google" content="notranslate" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <Meta />
        <Links />
      </head>
      <body className="bg-background flex justify-center h-dvh overflow-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <SplashScreen />;
}

export default function App() {
  const { showAndroidBanner, showIOSBanner, dismiss, dismissIOS } = usePWA();
  const [canShowBanners, setCanShowBanners] = useState(false);

  useEffect(() => {
    if (showAndroidBanner || showIOSBanner) {
      const timer = setTimeout(() => setCanShowBanners(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAndroidBanner, showIOSBanner]);

  return (
    <main className="w-full h-full max-w-sm flex flex-col overflow-hidden relative">
      <Header />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-12">
        <Outlet />
      </div>

      {showAndroidBanner && canShowBanners && (
        <AndroidInstallBanner onDismiss={dismiss} />
      )}

      {showIOSBanner && canShowBanners && (
        <IOSInstallBanner onDismiss={dismissIOS} />
      )}
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t("errors.unexpected");

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) message = t("errors.not_found");
    else message = error.statusText || message;
  } else if (isApiError(error)) {
    if (error.code === "TIMEOUT") message = t("errors.timeout");
    else if (error.code === "NETWORK_ERROR") message = t("errors.connection");
    else if (error.code === "SERVER_OFFLINE") message = t("errors.offline");
    else message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ErrorView
        message={message}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
