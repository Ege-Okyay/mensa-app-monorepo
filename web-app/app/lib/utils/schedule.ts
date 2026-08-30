import type { Schedule } from "../api/types";

export type ScheduleStatus =
  | { kind: "opens"; time: string }
  | { kind: "closes"; time: string }
  | { kind: "closed" };

export function getScheduleStatus(schedule: Schedule | null): ScheduleStatus | null {
  if (!schedule) return null;

  const now = new Date();
  const fmt = (opts: Intl.DateTimeFormatOptions) => now.toLocaleString("en-US", { timeZone: "Europe/Rome", ...opts });
  
  const day = fmt({ weekday: "short" }).toLowerCase();
  const ranges = schedule[day];
  
  // If there is no schedule info for the day OR empty inside with no hours -> its closed
  if (!ranges || ranges.length === 0) return { kind: "closed" };
  
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const nowMinutes = toMinutes(fmt({ hour: "2-digit", minute: "2-digit", hour12: false }));
  const active = ranges.find((r) => nowMinutes >= toMinutes(r.open) && nowMinutes < toMinutes(r.close));

  if (active) return { kind: "closes", time: active.close };

  const next = ranges.find((r) => nowMinutes < toMinutes(r.open));

  if (next) return { kind: "opens", time: next.open };

  return { kind: "closed" };
}
