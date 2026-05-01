import { Share, PlusSquare, X, UtensilsCrossed, MoreHorizontal } from "lucide-react";
import { useTranslation } from "~/lib/contexts/language-context";

export default function IOSInstallPrompt({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-4 left-1/2 w-[94%] max-w-sm bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 border border-white/20 flex flex-col gap-5 z-100 animate-slide-up transform-[translateX(-50%)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand/20">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-h2 text-text leading-tight">{t("install.title")}</h3>
            <p className="text-[13px] text-text-muted mt-1 leading-snug">{t("install.description")}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 -mr-2 -mt-2 text-text-muted hover:bg-slate-100/50 rounded-full transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-[14px] text-text">
          <div className="flex gap-1 shrink-0">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Share className="w-4 h-4 text-blue-500" />
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <p className="flex-1 leading-tight text-[13px]">
            {t("install.ios_steps.step1")}
          </p>
        </div>

        <div className="flex items-center gap-4 text-[14px] text-text">
          <div className="w-17 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <PlusSquare className="w-4 h-4 text-slate-700" />
          </div>
          <p className="flex-1 leading-tight text-[13px]">
            {t("install.ios_steps.step2")}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
    </div>
  );
}