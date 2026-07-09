import { UtensilsCrossed } from "lucide-react";
import { useTranslation } from "~/lib/contexts/language-context";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 border-b-4 border-black/10">
          <UtensilsCrossed className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-black text-text tracking-tight">
          Mensa<span className="text-brand">Today</span>
        </span>
      </div>

      <span className="text-body-sm font-bold uppercase tracking-widest text-text-muted/60">
        {t("footer.tagline")}
      </span>

      <span className="text-body-sm text-text-muted opacity-60">
        {t("footer.no_affiliation")}
      </span>
    </footer>
  );
}
