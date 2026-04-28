import { AlertCircle, ChevronRight, FileText } from "lucide-react";
import type { Mensa } from "~/lib/api/types";
import { useTranslation } from "~/lib/contexts/language-context";

interface MensaCardProps {
  mensa: Mensa;
  hasMenu: boolean;
  imageUrl: string;
}

export function MensaCard({ mensa, hasMenu, imageUrl }: MensaCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-sm">
        <img
          src={imageUrl}
          alt={`${mensa.name} image`}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover ${!hasMenu && 'grayscale'}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-h1 font-bold text-text tracking-tight">{mensa.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            {hasMenu ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-body-sm font-black uppercase tracking-widest">{t("status.menu_available")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-text-muted">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-body-sm font-bold uppercase tracking-widest italic">{t("status.not_published")}</span>
              </div>
            )}
          </div>
        </div>

        {hasMenu && (
          <div className="bg-brand w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 group-active:translate-x-1 transition-transform">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
