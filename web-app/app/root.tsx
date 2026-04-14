import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import LanguageSelector from "./components/language-selector";
import { UtensilsCrossed } from "lucide-react";

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
    <html data-theme="light" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background flex justify-center h-dvh overflow-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <main className="w-full h-full max-w-sm flex flex-col overflow-hidden">
      <header className="px-5 pt-8 pb-4 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-row items-center justify-between">
          <Link to="/">
            <div className="flex flex-row items-center gap-3 active:scale-95 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 border-b-4 border-black/10">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-h1 font-black text-black tracking-tighter leading-tight">
                Mensa<span className="text-brand">Today</span>
              </h1>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-12">
        <Outlet />
      </div>
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
