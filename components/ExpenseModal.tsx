"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Expense, ExpenseCategory } from "@/lib/types";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_META } from "@/lib/constants";
import { generateId } from "@/lib/storage";
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
          background: "linear-gradient(135deg, #151a22 0%, #0d1117 100%)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <h2 className="text-xl font-semibold text-white">
            {expense ? "Editar gasto" : "Nuevo gasto"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
              Descripción
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Cena restaurante, gasolina..."
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => !errors.name && (e.target.style.borderColor = "#10b981")}
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
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: "#18181f" }}>
                  {EXPENSE_CATEGORY_META[cat].icon} {EXPENSE_CATEGORY_META[cat].label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Importe (€)
              </label>
              <input
                type="number"
                value={form.amount || ""}
                onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.amount ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => !errors.amount && (e.target.style.borderColor = "#10b981")}
                onBlur={(e) => !errors.amount && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {errors.amount && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
                Fecha
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.date ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                  colorScheme: "dark",
                }}
                onFocus={(e) => !errors.date && (e.target.style.borderColor = "#10b981")}
                onBlur={(e) => !errors.date && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {errors.date && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.date}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>
              Notas <span style={{ color: "#475569" }}>(opcional)</span>
            </label>
            <input
              type="text"
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Detalles adicionales..."
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={(e) => (e.target.style.borderColor = "#10b981")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm font-medium transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer text-white"
              style={{ background: "#6ee7b7", color: "#07100d", boxShadow: "0 4px 20px rgba(52,211,153,0.24)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {expense ? "Guardar cambios" : "Añadir gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
