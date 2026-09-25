"use client";

import { Subscription } from "@/lib/types";
import { getDaysUntilRenewal, formatCurrency } from "@/lib/calculations";
import { CATEGORY_META } from "@/lib/constants";
import { formatShortISODate } from "@/lib/dates";

export default function RenewalList({ subscriptions }: { subscriptions: Subscription[] }) {
  const upcoming = subscriptions
    .map((s) => ({ ...s, days: getDaysUntilRenewal(s.renewalDate) }))
    .filter((s) => s.days >= 0 && s.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold tracking-tight">Próximos cobros</h3>
        <span className="label-mono border-[1.5px] border-ink px-2 py-0.5">30 días</span>
      </div>

      {!upcoming.length ? (
        <p className="py-4 text-center font-mono text-sm text-ink-faint">
          Nada a la vista. Respira.
        </p>
      ) : (
        <ol className="divide-y-[1.5px] divide-dashed divide-ink/25">
          {upcoming.map((sub) => {
            const meta = CATEGORY_META[sub.category];
            const isUrgent = sub.days <= 3;
            const isNear = sub.days <= 7;

            return (
              <li key={sub.id} className="flex items-center gap-3 py-3">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center border-[1.5px] font-mono leading-none ${
                    isUrgent
                      ? "border-stamp bg-stamp text-paper-2"
                      : isNear
                      ? "border-ink bg-marker text-ink"
                      : "border-ink text-ink"
                  }`}
                >
                  {sub.days === 0 ? (
                    <span className="text-[11px] font-medium uppercase">Hoy</span>
                  ) : (
                    <>
                      <span className="text-lg font-medium tabular-nums">{sub.days}</span>
                      <span className="mt-0.5 text-[9px] uppercase tracking-wider">días</span>
                    </>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    <span className="mr-1.5">{meta.icon}</span>
                    {sub.name}
                  </p>
                  <p className="font-mono text-xs text-ink-faint">
                    {formatShortISODate(sub.renewalDate)}
                  </p>
                </div>
                <p className="flex-shrink-0 font-mono text-sm tabular-nums">
                  {formatCurrency(sub.price)}
                  <span className="text-ink-faint">
                    {sub.frequency === "monthly" ? "/m" : sub.frequency === "annual" ? "/a" : "/t"}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
