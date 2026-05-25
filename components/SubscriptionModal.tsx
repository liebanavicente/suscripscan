"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Category, PaymentFrequency, Subscription } from "@/lib/types";
import { CATEGORIES, CATEGORY_META, FREQUENCY_LABELS } from "@/lib/constants";
import { generateId } from "@/lib/storage";

interface Props {
  open: boolean;
  subscription?: Subscription | null;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
}

const today = new Date().toISOString().split("T")[0];

const empty: Omit<Subscription, "id"> = {
  name: "",
  category: "other",
  price: 0,
  frequency: "monthly",
  renewalDate: today,
};

export default function SubscriptionModal({
  open,
  subscription,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Omit<Subscription, "id">>(() =>
    subscription
      ? {
          name: subscription.name,
          category: subscription.category,
          price: subscription.price,
          frequency: subscription.frequency,
          renewalDate: subscription.renewalDate,
        }
      : empty
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Subscription, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (form.price <= 0) e.price = "El precio debe ser mayor que 0";
    if (!form.renewalDate) e.renewalDate = "La fecha es obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      id: subscription?.id ?? generateId(),
    });
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-2xl border animate-fade-in-up"
        style={{
          background: "linear-gradient(135deg, #18181f 0%, #111118 100%)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <h2 className="text-xl font-semibold text-white">
            {subscription ? "Editar suscripción" : "Nueva suscripción"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
              Nombre del servicio
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Netflix, Spotify..."
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => !errors.name && (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => !errors.name && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            {errors.name && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: "#18181f" }}>
                  {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
                </option>
              ))}
            </select>
          </div>

          {/* Price + Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Precio (€)
              </label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.price ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => !errors.price && (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => !errors.price && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {errors.price && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Frecuencia
              </label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as PaymentFrequency }))}
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
                  <option key={val} value={val} style={{ background: "#18181f" }}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Renewal date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
              Próxima renovación
            </label>
            <input
              type="date"
              value={form.renewalDate}
              onChange={(e) => setForm((f) => ({ ...f, renewalDate: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: errors.renewalDate ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                colorScheme: "dark",
              }}
              onFocus={(e) => !errors.renewalDate && (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => !errors.renewalDate && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            {errors.renewalDate && (
              <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.renewalDate}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm font-medium transition-all cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {subscription ? "Guardar cambios" : "Añadir suscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
