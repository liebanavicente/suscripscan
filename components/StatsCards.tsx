"use client";

import { Subscription } from "@/lib/types";
import {
  formatCurrency,
  getDailyPrice,
  getMostExpensiveCategory,
  getTotalAnnual,
  getTotalMonthly,
} from "@/lib/calculations";
import { CATEGORY_META } from "@/lib/constants";

interface StatCardProps {
  n: string;
  label: string;
  value: string;
  sub?: string;
  tone?: "paper" | "ink" | "marker";
  delay?: number;
}

const tones = {
  paper: "bg-paper-2 text-ink",
  ink: "bg-ink text-paper-2",
  marker: "bg-marker text-ink",
};

function StatCard({ n, label, value, sub, tone = "paper", delay = 0 }: StatCardProps) {
  const dim = tone === "ink" ? "text-paper-2/55" : "text-ink-soft";
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className={`stub relative h-full border-[1.5px] border-ink px-6 py-5 ${tones[tone]}`}>
        <div className="flex items-center justify-between">
          <p className={`label-mono ${dim}`}>{label}</p>
          <p className={`font-mono text-[11px] ${dim}`}>{n}</p>
        </div>
        <p
          className="mt-4 font-display text-[2rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-4xl"
          style={{ fontVariationSettings: '"wdth" 85' }}
        >
          {value}
        </p>
        <div className={`mt-4 border-t-[1.5px] border-dashed pt-3 ${tone === "ink" ? "border-paper-2/30" : "border-ink/30"}`}>
          <p className={`truncate font-mono text-xs ${dim}`}>{sub}</p>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ subscriptions }: { subscriptions: Subscription[] }) {
  const monthly = getTotalMonthly(subscriptions);
  const annual = getTotalAnnual(subscriptions);
  const daily = getDailyPrice(subscriptions);
  const mostExpCat = getMostExpensiveCategory(subscriptions);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        n="01"
        label="Gasto mensual"
        value={formatCurrency(monthly)}
        sub={`${subscriptions.length} suscripci${subscriptions.length === 1 ? "ón" : "ones"}`}
        tone="ink"
      />
      <StatCard
        n="02"
        label="Gasto anual"
        value={formatCurrency(annual)}
        sub="Proyección a 12 meses"
        tone="marker"
        delay={80}
      />
      <StatCard
        n="03"
        label="Gasto diario"
        value={formatCurrency(daily)}
        sub="Lo que cuesta cada día"
        delay={160}
      />
      <StatCard
        n="04"
        label="Categoría más cara"
        value={mostExpCat ? formatCurrency(mostExpCat.total) : "—"}
        sub={
          mostExpCat
            ? `${CATEGORY_META[mostExpCat.category].icon} ${CATEGORY_META[mostExpCat.category].label}`
            : "Sin datos"
        }
        delay={240}
      />
    </div>
  );
}
