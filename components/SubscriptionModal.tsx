"use client";

import { useState } from "react";
import { Category, PaymentFrequency, Subscription } from "@/lib/types";
import { CATEGORIES, CATEGORY_META, FREQUENCY_LABELS } from "@/lib/constants";
import { generateId } from "@/lib/storage";
import ModalShell, { Field } from "@/components/ModalShell";

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


  if (!open) return null;

  return (
    <ModalShell
      title={subscription ? "Editar suscripción" : "Nueva suscripción"}
      kicker={subscription ? "Corrección de línea" : "Añadir línea al tique"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6 px-6 pt-6">
        <Field label="Nombre del servicio" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej. Netflix, Spotify..."
            aria-invalid={!!errors.name}
            className="field"
            autoFocus
          />
        </Field>

        <Field label="Categoría">
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
            className="field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Precio (€)" error={errors.price}>
            <input
              type="number"
              value={form.price || ""}
              onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              step="0.01"
              min="0"
              aria-invalid={!!errors.price}
              className="field tabular-nums"
            />
          </Field>

          <Field label="Frecuencia">
            <select
              value={form.frequency}
              onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as PaymentFrequency }))}
              className="field"
            >
              {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Próxima renovación" error={errors.renewalDate}>
          <input
            type="date"
            value={form.renewalDate}
            onChange={(e) => setForm((f) => ({ ...f, renewalDate: e.target.value }))}
            aria-invalid={!!errors.renewalDate}
            className="field"
          />
        </Field>

        <hr className="rule-dashed" />

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            {subscription ? "Guardar cambios" : "Añadir suscripción"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
