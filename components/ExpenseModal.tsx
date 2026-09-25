"use client";

import { useState } from "react";
import { Expense, ExpenseCategory } from "@/lib/types";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_META } from "@/lib/constants";
import { generateId } from "@/lib/storage";
import ModalShell, { Field } from "@/components/ModalShell";
import { todayLocalISODate } from "@/lib/dates";

interface Props {
  open: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export default function ExpenseModal({ open, expense, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<Expense, "id">>(() =>
    expense
      ? { name: expense.name, category: expense.category, amount: expense.amount, date: expense.date, notes: expense.notes }
      : { name: "", category: "otros", amount: 0, date: todayLocalISODate(), notes: "" }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Expense, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (form.amount <= 0) e.amount = "El importe debe ser mayor que 0";
    if (!form.date) e.date = "La fecha es obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, id: expense?.id ?? generateId() });
    onClose();
  }


  if (!open) return null;

  return (
    <ModalShell
      title={expense ? "Editar gasto" : "Nuevo gasto"}
      kicker={expense ? "Corrección de línea" : "Gasto puntual"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6 px-6 pt-6">
        <Field label="Descripción" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej. Cena restaurante, gasolina..."
            aria-invalid={!!errors.name}
            className="field"
            autoFocus
          />
        </Field>

        <Field label="Categoría">
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
            className="field"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {EXPENSE_CATEGORY_META[cat].icon} {EXPENSE_CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Importe (€)" error={errors.amount}>
            <input
              type="number"
              value={form.amount || ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              step="0.01"
              min="0"
              aria-invalid={!!errors.amount}
              className="field tabular-nums"
            />
          </Field>

          <Field label="Fecha" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              aria-invalid={!!errors.date}
              className="field"
            />
          </Field>
        </div>

        <Field label="Notas" hint="(opcional)">
          <input
            type="text"
            value={form.notes ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Detalles adicionales..."
            className="field"
          />
        </Field>

        <hr className="rule-dashed" />

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            {expense ? "Guardar cambios" : "Añadir gasto"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
