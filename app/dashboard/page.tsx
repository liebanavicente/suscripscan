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
import Barcode from "@/components/Barcode";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="label-mono animate-pulse text-ink-soft">Escaneando…</p>
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

  const annual = monthly * 12;

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="btn btn-quiet h-9 w-9 px-0 flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>

          <BrandMark size="sm" className="hidden min-[420px]:flex" />

          <div className="flex-1" />

          {/* Monthly totals */}
          <div className="hidden md:flex items-center gap-4 font-mono text-xs border-x-[1.5px] border-dashed border-ink/30 px-4">
            <div className="flex items-baseline gap-2">
              <span className="label-mono text-ink-faint">Suscr.</span>
              <span className="text-sm font-medium tabular-nums">{formatCurrency(monthly)}</span>
            </div>
            {thisMonthExps > 0 && (
              <div className="flex items-baseline gap-2">
                <span className="label-mono text-ink-faint">Gastos</span>
                <span className="text-sm font-medium tabular-nums text-carbon">{formatCurrency(thisMonthExps)}</span>
              </div>
            )}
          </div>

          {hasData && (
            <button
              onClick={handleReset}
              title="Borrar todos los datos"
              className={`btn px-3 ${resetConfirm ? "btn-danger" : "btn-quiet"}`}
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

          <button
            onClick={() => { setEditingExp(null); setExpModalOpen(true); }}
            className="btn btn-ghost px-3"
            title="Añadir gasto"
          >
            <Receipt size={15} />
            <span className="hidden sm:inline">Gasto</span>
          </button>

          <button
            onClick={() => { setEditingSub(null); setSubModalOpen(true); }}
            className="btn btn-primary px-3 sm:px-4"
            title="Añadir suscripción"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h1
            className="font-display text-4xl font-extrabold leading-none tracking-[-0.03em] sm:text-5xl"
            style={{ fontVariationSettings: '"wdth" 82' }}
          >
            Tu tique <span className="text-ink-faint">del mes</span>
          </h1>
          <p className="label-mono text-ink-faint" suppressHydrationWarning>
            {now.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })} · Terminal local
          </p>
        </div>

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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Tab switcher */}
              <div className="flex w-fit border-[1.5px] border-ink bg-paper-2" role="tablist">
                {([["subscriptions", "Suscripciones", subscriptions.length], ["expenses", "Gastos", expenses.length]] as const).map(([key, label, count], i) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => { setTab(key); setSearch(""); setFilter("all"); }}
                    className={`flex h-10 cursor-pointer items-center gap-2 px-4 text-sm font-semibold transition-colors ${i > 0 ? "border-l-[1.5px] border-ink" : ""} ${
                      tab === key ? "bg-ink text-paper-2" : "hover:bg-marker"
                    }`}
                  >
                    {label}
                    <span className="font-mono text-xs tabular-nums opacity-60">{count}</span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <label className="flex h-10 flex-1 items-center gap-2 border-[1.5px] border-ink bg-paper-2 px-3 focus-within:bg-[color-mix(in_srgb,var(--color-marker)_30%,var(--color-paper-2))]">
                <Search size={15} className="text-ink-soft" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={tab === "subscriptions" ? "Buscar suscripción..." : "Buscar gasto..."}
                  className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-ink-faint"
                />
              </label>
            </div>

            {tab === "subscriptions" && (
              <>
                <FilterBar selected={filter} onChange={setFilter} />
                <div className="flex items-center justify-between pt-2">
                  <h2 className="label-mono text-ink-soft">
                    {filtered.length} línea{filtered.length === 1 ? "" : "s"}
                  </h2>
                  {(filter !== "all" || search) && (
                    <button onClick={() => { setFilter("all"); setSearch(""); }} className="label-mono cursor-pointer text-stamp underline underline-offset-4">
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {filtered.length === 0 ? (
                  <EmptyState
                    title={subscriptions.length === 0 ? "Tique en blanco" : "Sin resultados"}
                    subtitle={subscriptions.length === 0 ? "Añade tu primera suscripción para empezar a escanear" : "Prueba con otro filtro o búsqueda"}
                  >
                    {subscriptions.length === 0 && (
                      <div className="flex gap-3 justify-center flex-wrap">
                        <button
                          onClick={() => { setEditingSub(null); setSubModalOpen(true); }}
                          className="btn btn-primary"
                        >
                          Añadir suscripción
                        </button>
                        <button
                          onClick={() => setSubscriptions(loadDemoSubscriptions())}
                          className="btn btn-ghost"
                        >
                          Cargar ejemplos
                        </button>
                      </div>
                    )}
                  </EmptyState>
                ) : (
                  <div className="card overflow-hidden">
                    {filtered.map(sub => (
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
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "expenses" && (
              <>
                <div className="flex items-center justify-between pt-2">
                  <h2 className="label-mono text-ink-soft">
                    {filteredExpenses.length} gasto{filteredExpenses.length === 1 ? "" : "s"} único{filteredExpenses.length === 1 ? "" : "s"}
                  </h2>
                </div>

                {filteredExpenses.length === 0 ? (
                  <EmptyState
                    title="No hay gastos registrados"
                    subtitle="Añade gastos puntuales como cenas, gasolina o compras"
                  >
                    <button
                      onClick={() => { setEditingExp(null); setExpModalOpen(true); }}
                      className="btn btn-primary"
                    >
                      Añadir gasto
                    </button>
                  </EmptyState>
                ) : (
                  <div className="card overflow-hidden">
                    {filteredExpenses.map(exp => (
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
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <RenewalList subscriptions={subscriptions} />

            {/* Resumen en forma de tique */}
            <div className="receipt-shadow">
              <div className="receipt-edge-y bg-paper-2 px-6 pb-9 pt-8 font-mono text-[13px]">
                <p className="text-center label-mono text-ink-soft">Resumen financiero</p>
                <hr className="rule-dashed my-4" />
                <div className="space-y-2">
                  <Row label="SUSCRIPCIONES/MES" value={formatCurrency(monthly)} />
                  <Row label="GASTOS ESTE MES" value={formatCurrency(thisMonthExps)} className="text-carbon" />
                </div>
                <div className="my-4 flex items-end justify-between border-y-2 border-ink py-2.5">
                  <span className="font-medium">TOTAL MES</span>
                  <span className="font-display text-2xl font-extrabold tabular-nums tracking-tight">
                    {formatCurrency(monthly + thisMonthExps)}
                  </span>
                </div>
                <div className="space-y-2 text-ink-soft">
                  <Row label="GASTO ANUAL EST." value={formatCurrency(annual)} />
                  <Row label="Nº SUSCRIPCIONES" value={String(subscriptions.length)} />
                  <Row label="Nº GASTOS" value={String(expenses.length)} />
                </div>
                {annual > 0 && (
                  <div className="mt-6 flex justify-center">
                    <span className="stamp text-xs">
                      {formatCurrency(annual)} / año
                    </span>
                  </div>
                )}
                <Barcode
                  value={String(Math.round(monthly * 100)).padStart(8, "0")}
                  className="mt-6 text-ink"
                  height={38}
                />
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

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`leader ${className}`}>
      <span>{label}</span>
      <span className="leader-fill" />
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function EmptyState({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="border-[1.5px] border-dashed border-ink/50 bg-paper-2/60 px-6 py-14 text-center">
      <p className="stamp stamp-ink mb-5 text-xs">Vacío</p>
      <p className="font-display text-xl font-bold tracking-tight">{title}</p>
      <p className="mb-6 mt-1 font-mono text-xs text-ink-faint">{subtitle}</p>
      {children}
    </div>
  );
}

function ExpenseRow({ expense, onEdit, onDelete }: { expense: Expense; onEdit: (e: Expense) => void; onDelete: (id: string) => void }) {
  const meta = EXPENSE_CATEGORY_META[expense.category];
  return (
    <div className="group relative flex items-center gap-4 border-b-[1.5px] border-dashed border-ink/25 bg-paper-2 px-4 py-3.5">
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: meta.color }} />
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border-[1.5px] border-ink bg-paper text-lg">
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold tracking-tight">{expense.name}</p>
        <p className="label-mono mt-1 text-ink-faint">
          {meta.label} · {expense.date}
        </p>
      </div>
      <span className="flex-shrink-0 font-mono text-lg font-medium tabular-nums text-carbon">
        {formatCurrency(expense.amount)}
      </span>
      <div className="flex gap-1">
        <button onClick={() => onEdit(expense)} className="btn btn-quiet h-8 px-2.5 text-xs">
          Editar
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn btn-quiet h-8 px-2.5 text-xs hover:!bg-stamp-soft hover:!text-stamp"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function DeleteOverlay({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="animate-fade-in absolute inset-0 flex flex-wrap items-center justify-center gap-3 bg-stamp-soft/95 px-3">
      <p className="text-sm font-semibold text-stamp">¿Tachar {name}?</p>
      <button onClick={onConfirm} className="btn btn-danger h-8 px-3 text-xs">
        Sí, eliminar
      </button>
      <button onClick={onCancel} className="btn btn-ghost h-8 px-3 text-xs">
        Cancelar
      </button>
    </div>
  );
}
