import { AlertCircle, ChevronRight, FileText, MapPin, Star } from "lucide-react";
import type { Mensa, Schedule } from "~/lib/api/types";
import { useTranslation } from "~/lib/contexts/language-context";
import { ScheduleBadge } from "../schedule-badge";

interface MensaCardProps {
  mensa: Mensa;
  hasMenu: boolean;
  imageUrl: string;
  isStarred: boolean;
  onStarToggle: () => void;
  schedule: Schedule | null;
}

export function MensaCard({ mensa, hasMenu, imageUrl, isStarred, onStarToggle, schedule }: MensaCardProps) {
  const { t } = useTranslation();

  const handleMapsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const query = encodeURIComponent(`${mensa.name} ${mensa.location || ""}`.trim());
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStarToggle();
  };

  return (
    <div className="flex flex-col gap-4 group group-active:scale-95 transition-all">
      <div className="relative h-48 w-full rounded-3xl overflow-hidden shadow-sm">
        <img
          src={imageUrl}
          alt={mensa.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hasMenu && "grayscale opacity-80"}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
        {schedule != null && (
          <div className="absolute top-3 left-3">
            <ScheduleBadge schedule={schedule} />
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-between px-1">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className="text-h1 font-bold text-text tracking-tight truncate">{mensa.name}</h3>

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

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <div className="flex items-center bg-brand-soft rounded-2xl p-1 border border-brand-border-subtle">
            <button
              type="button"
              onClick={handleMapsClick}
              className="p-2.5 text-brand active:scale-90 transition-transform"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <div className="w-px h-5 bg-brand-border-subtle" />
            <button
              type="button"
              onClick={handleStarClick}
              className="p-2.5 text-brand active:scale-90 transition-transform"
            >
              <Star className={`w-5 h-5 ${isStarred ? "fill-brand" : ""}`} />
            </button>
          </div>

          {hasMenu && (
            <div className="bg-brand w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
