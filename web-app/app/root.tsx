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
import { LanguageProvider } from "./lib/contexts/language-context";
import Header from "./components/header";
import { useEffect, useState } from "react";
import InstallBanner from "./components/install-banner";
import SplashScreen from "./components/splash-screen";
import { useAppInitialization } from "./lib/hooks/use-app-initialization";
import { usePWA } from "./lib/hooks/use-pwa";

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

export default function App() {
  const isInitializing = useAppInitialization();
  const { showBanner, install, dismiss } = usePWA();

  if (isInitializing) {
    return (
      <main className="w-full h-full max-w-sm flex flex-col overflow-hidden">
        <SplashScreen />
      </main>
    );
  }

  return (
    <main className="w-full h-full max-w-sm flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-12">
        <Outlet />
      </div>

      {showBanner && (
        <InstallBanner onInstall={install} onDismiss={dismiss} />
      )}
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
