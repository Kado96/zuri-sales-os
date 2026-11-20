export type TimePreset =
  | "all"
  | "15m"
  | "30m"
  | "1h"
  | "24h"
  | "today"
  | "7d"
  | "30d"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export type TimeFilterState = {
  preset: TimePreset;
  startDateTime?: string; // Format ISO: YYYY-MM-DDTHH:mm
  endDateTime?: string;   // Format ISO: YYYY-MM-DDTHH:mm
};

export const DEFAULT_TIME_FILTER: TimeFilterState = {
  preset: "all",
};

/**
 * Détermine si une date/heure donnée est incluse dans le filtre temporel actif.
 * @param dateStr Date au format YYYY-MM-DD ou ISO string
 * @param timeStr Heure optionnelle au format HH:mm
 */
export function isWithinTimeFilter(
  dateStr?: string,
  timeStr?: string,
  filter: TimeFilterState = DEFAULT_TIME_FILTER
): boolean {
  if (!filter || filter.preset === "all") return true;
  if (!dateStr) return false;

  // Résolution du timestamp cible
  let targetTime: number;
  if (dateStr.includes("T")) {
    targetTime = new Date(dateStr).getTime();
  } else {
    const timePart = timeStr && timeStr.includes(":") ? timeStr : "12:00";
    targetTime = new Date(`${dateStr}T${timePart}:00`).getTime();
  }

  if (isNaN(targetTime)) return true;

  const now = Date.now();

  switch (filter.preset) {
    case "15m":
      return targetTime >= now - 15 * 60 * 1000 && targetTime <= now;
    case "30m":
      return targetTime >= now - 30 * 60 * 1000 && targetTime <= now;
    case "1h":
      return targetTime >= now - 60 * 60 * 1000 && targetTime <= now;
    case "24h":
      return targetTime >= now - 24 * 60 * 60 * 1000 && targetTime <= now;
    case "today": {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      return targetTime >= todayStart.getTime() && targetTime <= todayEnd.getTime();
    }
    case "7d":
      return targetTime >= now - 7 * 24 * 60 * 60 * 1000 && targetTime <= now;
    case "30d":
      return targetTime >= now - 30 * 24 * 60 * 60 * 1000 && targetTime <= now;
    case "this_month": {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return targetTime >= start.getTime() && targetTime <= now;
    }
    case "last_month": {
      const start = new Date();
      start.setMonth(start.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
      return targetTime >= start.getTime() && targetTime <= end.getTime();
    }
    case "this_year": {
      const start = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
      return targetTime >= start.getTime() && targetTime <= now;
    }
    case "custom": {
      const start = filter.startDateTime ? new Date(filter.startDateTime).getTime() : 0;
      const end = filter.endDateTime ? new Date(filter.endDateTime).getTime() : Infinity;
      return targetTime >= start && targetTime <= end;
    }
    default:
      return true;
  }
}
