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
    <div className="group relative flex items-center gap-3 border-b-[1.5px] border-dashed border-ink/25 bg-paper-2 py-4 pl-5 pr-3 transition-colors sm:gap-4 sm:px-4 sm:pl-6 hover:bg-[color-mix(in_srgb,var(--color-marker)_22%,var(--color-paper-2))]">
      {/* Tinta de categoría */}
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: meta.color }} />

      <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center border-[1.5px] border-ink bg-paper text-lg sm:flex">
        {meta.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold tracking-tight">
          <span className="mr-1.5 sm:hidden">{meta.icon}</span>
          {subscription.name}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <p className="label-mono truncate text-ink-faint">{meta.label}</p>
          {isUrgent && (
            <span className="stamp flex-shrink-0 text-[10px]">
              {daysUntil === 0 ? "Cobra hoy" : `En ${daysUntil}d`}
            </span>
          )}
        </div>
        {subscription.notes && (
          <p className="mt-1 truncate text-xs text-ink-soft">{subscription.notes}</p>
        )}
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="font-mono text-lg font-medium tabular-nums">{formatCurrency(monthlyPrice)}</p>
        <p className="font-mono text-[11px] text-ink-faint">
          {subscription.frequency !== "monthly"
            ? `${formatCurrency(subscription.price)} / ${FREQUENCY_LABELS[subscription.frequency].toLowerCase()}`
            : "por mes"}
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          onClick={() => onEdit(subscription)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center border-[1.5px] border-transparent text-ink-soft transition-colors hover:border-ink hover:bg-paper-2 hover:text-ink"
          title="Editar"
          aria-label={`Editar ${subscription.name}`}
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(subscription.id)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center border-[1.5px] border-transparent text-ink-soft transition-colors hover:border-stamp hover:bg-stamp-soft hover:text-stamp"
          title="Eliminar"
          aria-label={`Eliminar ${subscription.name}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
