"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, Search, RotateCcw, Receipt } from "lucide-react";
import { Category, Expense, Subscription } from "@/lib/types";
import { loadSubscriptions, loadDemoSubscriptions, saveSubscriptions, loadExpenses, saveExpenses } from "@/lib/storage";
import { formatCurrency, getTotalMonthly } from "@/lib/calculations";
import { parseLocalISODate } from "@/lib/dates";
import { EXPENSE_CATEGORY_META } from "@/lib/constants";
import StatsCards from "@/components/StatsCards";
import CategoryChart from "@/components/CategoryChart";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionModal from "@/components/SubscriptionModal";
import ExpenseModal from "@/components/ExpenseModal";
import RenewalList from "@/components/RenewalList";
import ImpactPhrases from "@/components/ImpactPhrases";
import FilterBar from "@/components/FilterBar";
import ExportButton from "@/components/ExportButton";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import BrandMark from "@/components/BrandMark";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090f" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#34d399", borderTopColor: "transparent" }} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

type Tab = "subscriptions" | "expenses";

function DashboardContent() {
  useSearchParams();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    if (typeof window === "undefined") return [];
    const isDemo = new URLSearchParams(window.location.search).get("demo") === "true";
    const stored = loadSubscriptions();
    if (isDemo && stored.length === 0) return loadDemoSubscriptions();
    return stored;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window === "undefined") return [];
    return loadExpenses();
  });

  const [tab, setTab] = useState<Tab>("subscriptions");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [editingExp, setEditingExp] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const loaded = typeof window !== "undefined";

  useEffect(() => { if (loaded) saveSubscriptions(subscriptions); }, [subscriptions, loaded]);
  useEffect(() => { if (loaded) saveExpenses(expenses); }, [expenses, loaded]);

  // Subscription handlers
  function handleSaveSub(sub: Subscription) {
    setSubscriptions(prev => prev.find(s => s.id === sub.id) ? prev.map(s => s.id === sub.id ? sub : s) : [...prev, sub]);
  }
  function handleDeleteSub(id: string) {
    if (deleteConfirm === id) { setSubscriptions(prev => prev.filter(s => s.id !== id)); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  }
  function handleEditSub(sub: Subscription) { setEditingSub(sub); setSubModalOpen(true); }

  // Expense handlers
  function handleSaveExp(exp: Expense) {
    setExpenses(prev => prev.find(e => e.id === exp.id) ? prev.map(e => e.id === exp.id ? exp : e) : [...prev, exp]);
  }
  function handleDeleteExp(id: string) {
    if (deleteConfirm === id) { setExpenses(prev => prev.filter(e => e.id !== id)); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  }
  function handleEditExp(exp: Expense) { setEditingExp(exp); setExpModalOpen(true); }

  function handleReset() {
    if (resetConfirm) {
      setSubscriptions([]); saveSubscriptions([]);
      setExpenses([]); saveExpenses([]);
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  }

  const filtered = subscriptions
    .filter(s => filter === "all" || s.category === filter)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  const filteredExpenses = expenses
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => parseLocalISODate(b.date).getTime() - parseLocalISODate(a.date).getTime());

  const monthly = getTotalMonthly(subscriptions);
  const hasData = subscriptions.length > 0 || expenses.length > 0;

  // Current month expenses total
  const now = new Date();
  const thisMonthExps = expenses.filter(e => {
    const d = parseLocalISODate(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="min-h-screen premium-bg">
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: "rgba(7,10,14,0.84)", backdropFilter: "blur(18px)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ color: "#475569" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
          >
            <ArrowLeft size={18} />
          </Link>

          <BrandMark size="sm" />

          <div className="flex-1" />

          {/* Monthly totals pill */}
          <div
            className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#a7f3d0" }}>Suscripciones</span>
              <span className="text-sm font-bold text-white tabular-nums">{formatCurrency(monthly)}</span>
            </div>
            {thisMonthExps > 0 && (
              <>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#10b981" }}>Gastos</span>
                  <span className="text-sm font-bold text-white tabular-nums">{formatCurrency(thisMonthExps)}</span>
                </div>
              </>
            )}
          </div>

          {hasData && (
            <button
              onClick={handleReset}
              title="Borrar todos los datos"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: resetConfirm ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                color: resetConfirm ? "#ef4444" : "#475569",
                border: resetConfirm ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">{resetConfirm ? "¿Confirmar?" : "Resetear"}</span>
            </button>
          )}

          <ExportButton
            subscriptions={subscriptions}
            expenses={expenses}
            onImport={({ subscriptions: subs, expenses: exps }) => { setSubscriptions(subs); setExpenses(exps); }}
          />

          {/* Add expense button */}
          <button
            onClick={() => { setEditingExp(null); setExpModalOpen(true); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: "rgba(52,211,153,0.1)",
              color: "#a7f3d0",
              border: "1px solid rgba(52,211,153,0.22)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.16)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.1)"; }}
          >
            <Receipt size={15} />
            <span className="hidden sm:inline">Gasto</span>
          </button>

          {/* Add subscription button */}
          <button
            onClick={() => { setEditingSub(null); setSubModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
            style={{ background: "#6ee7b7", color: "#07100d", boxShadow: "0 10px 24px rgba(52,211,153,0.18)" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <ImpactPhrases subscriptions={subscriptions} />

        <section>
          <StatsCards subscriptions={subscriptions} />
        </section>

        <section>
          <MonthlyCalendar subscriptions={subscriptions} expenses={expenses} />
        </section>

        <section>
          <CategoryChart subscriptions={subscriptions} />
        </section>

        {/* Tabs + list */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Tab switcher */}
            <div
              className="flex gap-1 p-1 rounded-xl w-fit"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {([["subscriptions", "Suscripciones", subscriptions.length], ["expenses", "Gastos", expenses.length]] as const).map(([key, label, count]) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setSearch(""); setFilter("all"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: tab === key ? "rgba(255,255,255,0.08)" : "transparent",
                    color: tab === key ? "#e2e8f0" : "#475569",
                  }}
                >
                  {label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full tabular-nums"
                    style={{ background: tab === key ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", color: tab === key ? "#94a3b8" : "#334155" }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Search size={15} style={{ color: "#475569" }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tab === "subscriptions" ? "Buscar suscripción..." : "Buscar gasto..."}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#334155]"
              />
            </div>

            {tab === "subscriptions" && (
              <>
                <FilterBar selected={filter} onChange={setFilter} />
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Suscripciones{" "}
                    <span className="text-xs font-normal ml-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}>
                      {filtered.length}
                    </span>
                  </h2>
                  {(filter !== "all" || search) && (
                    <button onClick={() => { setFilter("all"); setSearch(""); }} className="text-xs cursor-pointer" style={{ color: "#a7f3d0" }}>
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filtered.length === 0 ? (
                    <EmptyState
                      icon="📭"
                      title={subscriptions.length === 0 ? "No tienes suscripciones aún" : "Sin resultados"}
                      subtitle={subscriptions.length === 0 ? "Añade tu primera suscripción para empezar" : "Prueba con otro filtro o búsqueda"}
                    >
                      {subscriptions.length === 0 && (
                        <div className="flex gap-3 justify-center flex-wrap">
                          <button
                            onClick={() => { setEditingSub(null); setSubModalOpen(true); }}
                            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white cursor-pointer"
                            style={{ background: "#6ee7b7", color: "#07100d" }}
                          >
                            Añadir suscripción
                          </button>
                          <button
                            onClick={() => setSubscriptions(loadDemoSubscriptions())}
                            className="text-sm font-medium px-5 py-2.5 rounded-xl cursor-pointer"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}
                          >
                            Cargar ejemplos
                          </button>
                        </div>
                      )}
                    </EmptyState>
                  ) : (
                    filtered.map(sub => (
                      <div key={sub.id} className="relative">
                        <SubscriptionCard subscription={sub} onEdit={handleEditSub} onDelete={handleDeleteSub} />
                        {deleteConfirm === sub.id && (
                          <DeleteOverlay
                            name={sub.name}
                            onConfirm={() => handleDeleteSub(sub.id)}
                            onCancel={() => setDeleteConfirm(null)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {tab === "expenses" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Gastos únicos{" "}
                    <span className="text-xs font-normal ml-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}>
                      {filteredExpenses.length}
                    </span>
                  </h2>
                </div>

                <div className="space-y-2">
                  {filteredExpenses.length === 0 ? (
                    <EmptyState
                      icon="🧾"
                      title="No hay gastos registrados"
                      subtitle="Añade gastos puntuales como cenas, gasolina o compras"
                    >
                      <button
                        onClick={() => { setEditingExp(null); setExpModalOpen(true); }}
                        className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white cursor-pointer"
                        style={{ background: "#6ee7b7", color: "#07100d" }}
                      >
                        Añadir gasto
                      </button>
                    </EmptyState>
                  ) : (
                    filteredExpenses.map(exp => (
                      <div key={exp.id} className="relative">
                        <ExpenseRow expense={exp} onEdit={handleEditExp} onDelete={handleDeleteExp} />
                        {deleteConfirm === exp.id && (
                          <DeleteOverlay
                            name={exp.name}
                            onConfirm={() => handleDeleteExp(exp.id)}
                            onCancel={() => setDeleteConfirm(null)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <RenewalList subscriptions={subscriptions} />

            <div
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(248,216,137,0.05) 100%)", border: "1px solid rgba(52,211,153,0.18)" }}
            >
              <p className="text-xs font-medium mb-4" style={{ color: "#a7f3d0" }}>Resumen financiero</p>
              <div className="space-y-3">
                <Row label="Suscripciones/mes" value={formatCurrency(getTotalMonthly(subscriptions))} color="#a7f3d0" />
                <Row label="Gastos este mes" value={formatCurrency(thisMonthExps)} color="#34d399" />
                <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <Row label="Total este mes" value={formatCurrency(getTotalMonthly(subscriptions) + thisMonthExps)} color="#f8d889" />
                </div>
                <Row label="Gasto anual est." value={formatCurrency(getTotalMonthly(subscriptions) * 12)} color="#f59e0b" />
                <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <Row label="Nº suscripciones" value={String(subscriptions.length)} color="#64748b" />
                  <Row label="Nº gastos" value={String(expenses.length)} color="#64748b" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SubscriptionModal
        key={editingSub?.id ?? (subModalOpen ? "new" : "closed")}
        open={subModalOpen}
        subscription={editingSub}
        onClose={() => { setSubModalOpen(false); setEditingSub(null); }}
        onSave={handleSaveSub}
      />

      <ExpenseModal
        key={editingExp?.id ?? (expModalOpen ? "new-exp" : "closed-exp")}
        open={expModalOpen}
        expense={editingExp}
        onClose={() => { setExpModalOpen(false); setEditingExp(null); }}
        onSave={handleSaveExp}
      />
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "#64748b" }}>{label}</span>
      <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div
      className="text-center py-16 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}
    >
      <p className="text-3xl mb-3">{icon}</p>
      <p className="text-sm font-medium text-white mb-1">{title}</p>
      <p className="text-xs mb-5" style={{ color: "#475569" }}>{subtitle}</p>
      {children}
    </div>
  );
}

function ExpenseRow({ expense, onEdit, onDelete }: { expense: Expense; onEdit: (e: Expense) => void; onDelete: (id: string) => void }) {
  const meta = EXPENSE_CATEGORY_META[expense.category];
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: `${meta.color}18` }}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{expense.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
          {meta.label} · {expense.date}
        </p>
      </div>
      <span className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: "#34d399" }}>
        {formatCurrency(expense.amount)}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(expense)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{ color: "#64748b" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{ color: "#64748b" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function DeleteOverlay({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl flex items-center justify-center gap-3 animate-fade-in"
      style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
    >
      <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>¿Eliminar {name}?</p>
      <button
        onClick={onConfirm}
        className="text-sm font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
        style={{ background: "#ef4444", color: "white" }}
      >
        Sí, eliminar
      </button>
      <button
        onClick={onCancel}
        className="text-sm px-3 py-1.5 rounded-lg cursor-pointer"
        style={{ background: "rgba(255,255,255,0.1)", color: "#94a3b8" }}
      >
        Cancelar
      </button>
    </div>
  );
}
