"use client";

import { TrendingUp, Calendar, Zap, Crown } from "lucide-react";
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
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accentColor: string;
  delay?: number;
}

function StatCard({ icon, label, value, sub, accentColor, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 card-hover animate-fade-in-up"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accentColor}20` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <p className="text-sm mb-1" style={{ color: "#64748b" }}>{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#475569" }}>{sub}</p>}
    </div>
  );
}

export default function StatsCards({ subscriptions }: { subscriptions: Subscription[] }) {
  const monthly = getTotalMonthly(subscriptions);
  const annual = getTotalAnnual(subscriptions);
  const daily = getDailyPrice(subscriptions);
  const mostExpCat = getMostExpensiveCategory(subscriptions);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<TrendingUp size={20} />}
        label="Gasto mensual"
        value={formatCurrency(monthly)}
        sub={`${subscriptions.length} suscripci${subscriptions.length === 1 ? "ón" : "ones"}`}
        accentColor="#7c3aed"
        delay={0}
      />
      <StatCard
        icon={<Calendar size={20} />}
        label="Gasto anual"
        value={formatCurrency(annual)}
        sub="Proyección total"
        accentColor="#06b6d4"
        delay={100}
      />
      <StatCard
        icon={<Zap size={20} />}
        label="Gasto diario"
        value={formatCurrency(daily)}
        sub="Coste aproximado/día"
        accentColor="#f59e0b"
        delay={200}
      />
      <StatCard
        icon={<Crown size={20} />}
        label="Categoría más cara"
        value={mostExpCat ? formatCurrency(mostExpCat.total) : "—"}
        sub={
          mostExpCat
            ? `${CATEGORY_META[mostExpCat.category].icon} ${CATEGORY_META[mostExpCat.category].label}`
            : "Sin datos"
        }
        accentColor="#10b981"
        delay={300}
      />
    </div>
  );
}
