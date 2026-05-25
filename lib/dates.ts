const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toLocalISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayLocalISODate(): string {
  return toLocalISODate(new Date());
}

export function addDaysToTodayISODate(days: number): string {
  const date = parseLocalISODate(todayLocalISODate());
  date.setDate(date.getDate() + days);
  return toLocalISODate(date);
}

export function parseLocalISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getDaysUntilISODate(value: string): number {
  const today = parseLocalISODate(todayLocalISODate());
  const target = parseLocalISODate(value);
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function formatShortISODate(value: string): string {
  return parseLocalISODate(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export function formatLongISODate(value: string): string {
  return parseLocalISODate(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
