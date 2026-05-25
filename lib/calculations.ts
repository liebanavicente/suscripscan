import { Category, CategoryStats, Subscription } from "./types";
import { CATEGORY_META } from "./constants";

export function toMonthlyPrice(sub: Subscription): number {
  switch (sub.frequency) {
    case "monthly":
      return sub.price;
    case "annual":
      return sub.price / 12;
    case "quarterly":
      return sub.price / 3;
  }
}

export function toAnnualPrice(sub: Subscription): number {
  return toMonthlyPrice(sub) * 12;
}

export function getTotalMonthly(subs: Subscription[]): number {
  return subs.reduce((acc, s) => acc + toMonthlyPrice(s), 0);
}

export function getTotalAnnual(subs: Subscription[]): number {
  return getTotalMonthly(subs) * 12;
}

export function getDailyPrice(subs: Subscription[]): number {
  return getTotalMonthly(subs) / 30;
}

export function getMostExpensiveSubscription(
  subs: Subscription[]
): Subscription | null {
  if (!subs.length) return null;
  return subs.reduce((max, s) =>
    toMonthlyPrice(s) > toMonthlyPrice(max) ? s : max
  );
}

export function getCategoryStats(subs: Subscription[]): CategoryStats[] {
  const map = new Map<Category, { total: number; count: number }>();

  for (const sub of subs) {
    const existing = map.get(sub.category) ?? { total: 0, count: 0 };
    map.set(sub.category, {
      total: existing.total + toMonthlyPrice(sub),
      count: existing.count + 1,
    });
  }

  return Array.from(map.entries())
    .map(([category, { total, count }]) => ({
      category,
      label: CATEGORY_META[category].label,
      total,
      count,
      color: CATEGORY_META[category].color,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getMostExpensiveCategory(subs: Subscription[]): CategoryStats | null {
  const stats = getCategoryStats(subs);
  return stats[0] ?? null;
}

export function getUpcomingRenewals(
  subs: Subscription[],
  days = 30
): Subscription[] {
  const now = new Date();
  const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return subs
    .filter((s) => {
      const d = new Date(s.renewalDate);
      return d >= now && d <= limit;
    })
    .sort(
      (a, b) =>
        new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
    );
}

export function getDaysUntilRenewal(renewalDate: string): number {
  const now = new Date();
  const d = new Date(renewalDate);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getImpactPhrases(subs: Subscription[]): string[] {
  const monthly = getTotalMonthly(subs);
  const annual = getTotalAnnual(subs);
  const mostExpCat = getMostExpensiveCategory(subs);
  const mostExpSub = getMostExpensiveSubscription(subs);
  const phrases: string[] = [];

  if (annual > 0) {
    phrases.push(
      `Estás gastando ${formatCurrency(annual)} al año en suscripciones`
    );
  }

  if (monthly > 0) {
    phrases.push(
      `Cada día que pasa te cuestan ${formatCurrency(monthly / 30)} tus servicios digitales`
    );
  }

  const aiStats = subs
    .filter((s) => s.category === "ai_tools")
    .reduce((acc, s) => acc + toMonthlyPrice(s), 0);
  const phoneStats = subs
    .filter((s) => s.category === "phone_internet")
    .reduce((acc, s) => acc + toMonthlyPrice(s), 0);

  if (aiStats > 0 && phoneStats > 0 && aiStats > phoneStats) {
    phrases.push("Tus herramientas IA cuestan más que tu teléfono");
  }

  if (mostExpCat && mostExpCat.count > 1) {
    phrases.push(
      `${mostExpCat.label} es tu categoría más cara con ${formatCurrency(mostExpCat.total)}/mes`
    );
  }

  if (mostExpSub) {
    phrases.push(
      `${mostExpSub.name} es tu suscripción más cara — ${formatCurrency(toMonthlyPrice(mostExpSub))}/mes`
    );
  }

  const streamingTotal = subs
    .filter((s) => s.category === "tv_streaming")
    .reduce((acc, s) => acc + toMonthlyPrice(s), 0);
  if (streamingTotal > 30) {
    phrases.push(
      `Solo en streaming gastas ${formatCurrency(streamingTotal)}/mes — ¿cuándo ves tanto?`
    );
  }

  if (annual > 1000) {
    phrases.push(
      `Con lo que gastas al año podrías pagarte ${Math.floor(annual / 1200)} mes${Math.floor(annual / 1200) > 1 ? "es" : ""} de vacaciones`
    );
  }

  return phrases;
}
