"use client";

import { Bell } from "lucide-react";
import { Subscription } from "@/lib/types";
import { getDaysUntilRenewal, formatCurrency, toMonthlyPrice } from "@/lib/calculations";
import { CATEGORY_META } from "@/lib/constants";

export default function RenewalList({ subscriptions }: { subscriptions: Subscription[] }) {
  const upcoming = subscriptions
    .map((s) => ({ ...s, days: getDaysUntilRenewal(s.renewalDate) }))
    .filter((s) => s.days >= 0 && s.days <= 30)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Bell size={16} style={{ color: "#f59e0b" }} />
        <h3 className="text-sm font-semibold text-white">Próximas renovaciones</h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full ml-auto"
          style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
        >
          30 días
        </span>
      </div>

      {!upcoming.length ? (
        <p className="text-sm text-center py-4" style={{ color: "#475569" }}>
          No hay renovaciones próximas
        </p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((sub) => {
            const meta = CATEGORY_META[sub.category];
            const isUrgent = sub.days <= 3;
            const isNear = sub.days <= 7;

            return (
              <div key={sub.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${meta.color}18` }}
                >
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{sub.name}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>
                    {formatCurrency(sub.price)}{" "}
                    {sub.frequency === "monthly"
                      ? "/ mes"
                      : sub.frequency === "annual"
                      ? "/ año"
                      : "/ trimestre"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color: isUrgent ? "#ef4444" : isNear ? "#f59e0b" : "#64748b",
                    }}
                  >
                    {sub.days === 0 ? "Hoy" : `${sub.days}d`}
                  </p>
                  <p className="text-xs" style={{ color: "#334155" }}>
                    {new Date(sub.renewalDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
