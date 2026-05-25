"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Subscription } from "@/lib/types";
import { CATEGORY_META, FREQUENCY_LABELS } from "@/lib/constants";
import { formatCurrency, getDaysUntilRenewal, toMonthlyPrice } from "@/lib/calculations";

interface Props {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionCard({ subscription, onEdit, onDelete }: Props) {
  const meta = CATEGORY_META[subscription.category];
  const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
  const isUrgent = daysUntil >= 0 && daysUntil <= 7;
  const monthlyPrice = toMonthlyPrice(subscription);

  return (
    <div
      className="group flex items-center gap-4 rounded-2xl p-4 transition-all card-hover cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{subscription.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: `${meta.color}18`,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
          {isUrgent && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
            >
              {daysUntil === 0 ? "Hoy" : `${daysUntil}d`}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-white tabular-nums">{formatCurrency(monthlyPrice)}</p>
        <p className="text-xs" style={{ color: "#475569" }}>
          {subscription.frequency !== "monthly"
            ? `${formatCurrency(subscription.price)} / ${FREQUENCY_LABELS[subscription.frequency].toLowerCase()}`
            : "por mes"}
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <button
          onClick={() => onEdit(subscription)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.2)";
            e.currentTarget.style.color = "#a78bfa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
          title="Editar"
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(subscription.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
          title="Eliminar"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
