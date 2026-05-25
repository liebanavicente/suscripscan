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
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: "#18181f",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="font-medium text-white mb-1">{item.payload.label}</p>
      <p style={{ color: item.payload.color }}>{formatCurrency(item.value)}/mes</p>
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
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: "#18181f",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="font-medium text-white mb-1">{label}</p>
      <p style={{ color: "#a78bfa" }}>{formatCurrency(payload[0].value)}/mes</p>
    </div>
  );
}

export default function CategoryChart({ subscriptions }: { subscriptions: Subscription[] }) {
  const stats = getCategoryStats(subscriptions);

  if (!stats.length) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: "#475569" }}>
        <p className="text-sm">Añade suscripciones para ver los gráficos</p>
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
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="text-sm font-medium mb-6" style={{ color: "#94a3b8" }}>
          Distribución por categoría
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry) => {
                const e = entry as { payload?: { label?: string } };
                return (
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>
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
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="text-sm font-medium mb-6" style={{ color: "#94a3b8" }}>
          Gasto mensual por categoría
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#475569", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
