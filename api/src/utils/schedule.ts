import { ScheduleSchema, type ScheduleRange } from '../models/mensa';

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Rome', weekday: 'short'
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Rome',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Checks wheter a mensa is inside one of its opening ranges
 * Mirros the badge logic in web-app/app/lib/utils/schedule.ts
 */
export const isMensaOpen = (rawSchedule: unknown, now: Date = new Date()): boolean => {
  const result = ScheduleSchema.safeParse(rawSchedule);
  if (!result.success) return false;

  const ranges: ScheduleRange[] = result.data[dayFormatter.format(now).toLowerCase()] ?? [];

  // If schedule is empty -> treat as closed
  if (ranges.length === 0) return false;

  const nowMinutes = toMinutes(timeFormatter.format(now));

  return ranges.some(
    ({ open, close }) => nowMinutes >= toMinutes(open) && nowMinutes < toMinutes(close)
  );
};
