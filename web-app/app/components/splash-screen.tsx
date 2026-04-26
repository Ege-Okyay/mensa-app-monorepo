import { UtensilsCrossed } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-100 animate-out fade-out duration-1000 delay-2000">
      <div className="w-24 h-24 bg-brand rounded-3xl flex items-center justify-center animate-bounce shadow-xl">
        <UtensilsCrossed className="w-12 h-12 text-white" />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="mt-4 text-h1 font-black text-black animate-pulse">
          Mensa<span className="text-brand">Today</span>
        </h1>

        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand w-1/3 rounded-full animate-[loading_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}
