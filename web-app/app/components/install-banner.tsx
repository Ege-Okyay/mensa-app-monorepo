import { UtensilsCrossed, X } from "lucide-react";
import { useTranslation } from "~/lib/contexts/language-context";

interface InstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function InstallBanner({ onInstall, onDismiss }: InstallBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 border border-border flex flex-row items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-700 z-50 overflow-hidden group">
      <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand/20">
        <UtensilsCrossed className="w-6 h-6 text-white"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[14px] text-text leading-tight">{t("install.title")}</h3>
        <p className="text-[11px] text-text-muted truncate">{t("install.description")}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onInstall}
          className="btn btn-sm bg-brand hover:bg-brand/90 text-white border-none rounded-xl px-4 h-9 min-h-0 font-bold text-body active:scale-95 transition-all"
        >
          {t("install.install_text")}
        </button>
        <button
          onClick={onDismiss}
          className="p-2 text-text-muted
   hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-brand/10 w-full">
        <div className="h-full bg-brand w-0 group-hover:w-full transition-all duration-3000 ease-linear" />
      </div>
    </div>
  )
}