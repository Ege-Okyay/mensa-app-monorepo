import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "~/lib/contexts/language-context";

export default function Footer() {
  const API_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
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

      <span className="text-body-sm font-bold tracking-widest text-text-muted/60">
        <Link
          to={"https://ege-okyay.github.io"}
          target="_blank"
          rel="noopener"
          className="text-brand"
        >ege </Link>
        made this so you don't have to
      </span>

      <div className="flex flex-col items-center gap-2 text-body-sm text-text-muted/60">
        <span>Not affiliated with Edisu or any official institution.</span>
        <div className="flex items-center gap-2">
          <Link to="/privacy" viewTransition className="hover:text-brand transition-colors">
            {t("legal.privacy_policy")}
          </Link>
          <span className="opacity-40">·</span>
          <Link to="/terms" viewTransition className="hover:text-brand transition-colors">
            {t("legal.terms_of_service")}
          </Link>
        </div>
      </div>

      <span className="text-body-sm text-text-muted/40">
        v{API_VERSION}
      </span>
    </footer>
  );
}
