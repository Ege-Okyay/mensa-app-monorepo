import LanguageSelector from "~/components/language-selector";
import type { Route } from "./+types/index";
import MensaCard from "~/components/mensa-card/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mensa Daily Menu" },
  ];
}

export default function Index() {
  return (
    <main className="w-full h-full max-w-sm">
      <div className="ml-5 mr-5 mt-8 mb-8">
        {/* Title bar */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-h1 font-bold text-black">Mensa Daily Menu</h1>
          <LanguageSelector />
        </div>

        {/* Content */}
        <div className="mt-8">
          <MensaCard />
        </div>
      </div>
    </main>
  );
}
