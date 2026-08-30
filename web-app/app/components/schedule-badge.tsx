import { AlarmClock, Ban, CalendarClock } from "lucide-react";
import type { Schedule } from "~/lib/api/types";
import { useTranslation } from "~/lib/contexts/language-context";
import { getScheduleStatus, type ScheduleStatus } from "~/lib/utils/schedule";

const STYLES: Record<
  ScheduleStatus["kind"],
  { icon: typeof Ban; className: string }
> = {
  opens: { icon: CalendarClock, className: "bg-brand-soft text-brand border-brand-border-subtle" },
  closes: { icon: AlarmClock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  closed: { icon: Ban, className: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

export function ScheduleBadge({ schedule }: { schedule: Schedule | null }) {
  const { t } = useTranslation();
  const status = getScheduleStatus(schedule);

  if (!status) return null;

  let label;
  if (status.kind === "closed") label = t("schedule.closed");
  if (status.kind === "opens") label = t("schedule.opens_at").replace("{time}", status.time);
  if (status.kind === "closes") label = t("schedule.closes_at").replace("{time}", status.time);

  const { icon: Icon, className } = STYLES[status.kind];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold w-fit shadow-sm backdrop-blur-sm ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
