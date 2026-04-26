import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router";
import LanguageSelector from "./language-selector";

export default function Header() {
  return (
    <header className="px-5 pt-8 pb-4 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex flex-row items-center justify-between">
        <Link viewTransition to="/">
          <div className="flex flex-row items-center gap-3 active:scale-95 transition-transform">
            <div className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 border-b-4 border-black/10">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-h1 font-black text-black tracking-tighter leading-tight">
                Mensa<span className="text-brand">Today</span>
              </h1>
              <div className="flex items-center gap-1 opacity-40">
                <div className="w-1 h-1 rounded-full bg-brand"></div>
                <span className="text-body-sm font-bold uppercase tracking-widest">Torino Piemonte</span>
              </div>
            </div>
          </div>
        </Link>
        <LanguageSelector />
      </div>
    </header>
  );
}
