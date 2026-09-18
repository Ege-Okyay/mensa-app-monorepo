import { AlarmClock, Ban, CalendarClock, Clock, Zap } from "lucide-react";
import SectionTitle from "./section-title";
import FoodCard from "./food-card";
import SideDish from "./side-dish";
import Allergy from "./allergy";
import type { MenuData, Schedule } from "~/lib/api/types";
import { useTranslation } from "~/lib/contexts/language-context";
import { getScheduleStatus, type ScheduleStatus } from "~/lib/utils/schedule";

interface MensaMenuCardProps {
  menu: MenuData;
  imageUrl: string;
  schedule: Schedule | null;
}

const BANNER_STYLES: Record<
  ScheduleStatus["kind"],
  { icon: typeof Ban; className: string }
> = {
  opens: { icon: CalendarClock, className: "bg-brand-soft text-brand border-brand-border-subtle" },
  closes: { icon: AlarmClock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  closed: { icon: Ban, className: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

export default function MensaMenuCard({ menu, imageUrl, schedule }: MensaMenuCardProps) {
  const { t } = useTranslation();
  const status = getScheduleStatus(schedule);

  let label: string | null = null;
  let Icon: typeof Ban | null = null;
  if (status) {
    Icon = BANNER_STYLES[status.kind].icon;
    if (status.kind === "closed") label = t("schedule.closed");
    else if (status.kind === "opens") label = t("schedule.opens_at").replace("{time}", status.time);
    else label = t("schedule.closes_at").replace("{time}", status.time);
  }

  const showBanner = status && status.kind !== "closes" && label;

  return (
    <div className="card bg-white w-full rounded-2xl shadow-sm overflow-y-auto h-[80svh] border border-border no-scrollbar flex flex-col">
      {showBanner && status && Icon && (
        <div className={`flex items-center justify-center gap-2 px-4 py-2.5 shrink-0 border-b ${BANNER_STYLES[status.kind].className}`}>
          <Icon className="w-4 h-4" />
          <span className="text-sm font-black uppercase tracking-widest">{label}</span>
        </div>
      )}

      <figure className="relative h-32 w-full shrink-0">
        <img
          src={imageUrl}
          alt={`${menu.mensa_name} header image`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-ends justify-start">
          <div className="mb-3 ml-4 mr-4 flex flex-row justify-between items-end w-full">
            <div className="flex flex-col justify-end items-start gap-1.5">
              {menu.specialties_available && (
                <div className="bg-brand px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm mb-0.5">
                  <Zap className="w-3 h-3 text-white fill-white" />
                  <span className="text-white font-semibold text-body-sm uppercase tracking-tighter">{t("menu.specialties")}</span>
                </div>
              )}

              <h2 className="text-white font-bold text-h1 leading-tight">
                Mensa {menu.mensa_name}
              </h2>
            </div>
          </div>
        </div>
      </figure>

      {menu.common_allergens?.length > 0 && (
        <div className="px-4 pt-4 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-body-sm font-bold text-text-muted uppercase tracking-[0.15em]">{t("allergens.common")}</span>
            <div className="flex flex-row gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {menu.common_allergens.map((allergen) => (
                <Allergy key={allergen} name={allergen} />
              ))}
            </div>
          </div>
          <div className="divider m-0 mt-2 h-px opacity-50"></div>
        </div>
      )}

      <div className="flex-1 px-3 pb-6">
        <div className="space-y-6">
          <div>
            <SectionTitle title={t("menu.first_courses")} />
            <div className="flex flex-col gap-2.5">
              {menu.first_courses.map((course, index) => (
                <FoodCard key={index} menuItem={course} />
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title={t("menu.main_courses")} />
            <div className="flex flex-col gap-2.5">
              {menu.main_courses.map((course, index) => (
                <FoodCard key={index} menuItem={course} />
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title={t("menu.side_dishes")} />
            <div className="flex flex-col gap-2.5">
              {menu.side_dishes.map((course, index) => (
                <SideDish key={index} menuItem={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
