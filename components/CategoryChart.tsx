"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Subscription } from "@/lib/types";
import { getCategoryStats, formatCurrency } from "@/lib/calculations";
import { CATEGORY_META } from "@/lib/constants";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { label: string; color: string } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="card-flat px-3 py-2 font-mono text-xs" style={{ boxShadow: "3px 3px 0 var(--color-ink)" }}>
      <p className="mb-1 font-medium text-ink">{item.payload.label}</p>
      <p className="tabular-nums text-ink-soft">{formatCurrency(item.value)}/mes</p>
    </div>
  );
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-flat px-3 py-2 font-mono text-xs" style={{ boxShadow: "3px 3px 0 var(--color-ink)" }}>
      <p className="mb-1 font-medium text-ink">{label}</p>
      <p className="tabular-nums text-ink-soft">{formatCurrency(payload[0].value)}/mes</p>
    </div>
  );
}

function ChartTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b-[1.5px] border-dashed border-ink/30 pb-3">
      <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
      <span className="label-mono text-ink-faint">Fig. {n}</span>
    </div>
  );
}

export default function CategoryChart({ subscriptions }: { subscriptions: Subscription[] }) {
  const stats = getCategoryStats(subscriptions);

  if (!stats.length) {
    return (
      <div className="card-flat flex h-48 items-center justify-center border-dashed">
        <p className="font-mono text-sm text-ink-faint">Añade suscripciones para ver los gráficos</p>
      </div>
    );
  }

  const pieData = stats.map((s) => ({
    name: s.category,
    label: CATEGORY_META[s.category].label,
    value: parseFloat(s.total.toFixed(2)),
    color: s.color,
  }));

  const barData = stats.map((s) => ({
    name: CATEGORY_META[s.category].icon + " " + CATEGORY_META[s.category].label.split(" ")[0],
    fullName: CATEGORY_META[s.category].label,
    value: parseFloat(s.total.toFixed(2)),
    color: s.color,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut chart */}
      <div className="card p-6">
        <ChartTitle n="A" title="Reparto por categoría" />
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry) => {
                const e = entry as { payload?: { label?: string } };
                return (
                  <span style={{ color: "var(--color-ink-soft)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                    {e.payload?.label ?? value}
                  </span>
                );
              }}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="card p-6">
        <ChartTitle n="B" title="Gasto mensual por categoría" />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(23,21,15,0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--color-ink-soft)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-ink-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,225,74,0.35)" }} />
            <Bar dataKey="value" radius={0} stroke="var(--color-ink)" strokeWidth={1.5}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
