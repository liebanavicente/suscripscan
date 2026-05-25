"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, Search } from "lucide-react";
import { Category, Subscription } from "@/lib/types";
import { loadSubscriptions, loadDemoSubscriptions, saveSubscriptions } from "@/lib/storage";
import { formatCurrency, getTotalMonthly } from "@/lib/calculations";
import StatsCards from "@/components/StatsCards";
import CategoryChart from "@/components/CategoryChart";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionModal from "@/components/SubscriptionModal";
import RenewalList from "@/components/RenewalList";
import ImpactPhrases from "@/components/ImpactPhrases";
import FilterBar from "@/components/FilterBar";
import ExportButton from "@/components/ExportButton";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090f" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const isDemo = searchParams.get("demo") === "true";
    const stored = loadSubscriptions();
    if (isDemo && stored.length === 0) return loadDemoSubscriptions();
    return stored;
  });
  const [filter, setFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    saveSubscriptions(subscriptions);
  }, [subscriptions]);

  function handleSave(sub: Subscription) {
    setSubscriptions((prev) => {
      const exists = prev.find((s) => s.id === sub.id);
      if (exists) return prev.map((s) => (s.id === sub.id ? sub : s));
      return [...prev, sub];
    });
  }

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  function handleEdit(sub: Subscription) {
    setEditing(sub);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  const filtered = subscriptions
    .filter((s) => filter === "all" || s.category === filter)
    .filter(
      (s) =>
        !search || s.name.toLowerCase().includes(search.toLowerCase())
    );

  const monthly = getTotalMonthly(subscriptions);

  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#475569";
            }}
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
            >
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-bold text-white text-base">Suscripscan</span>
          </div>

          <div className="flex-1" />

          {/* Monthly total pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <span className="text-xs" style={{ color: "#7c3aed" }}>Mensual</span>
            <span className="text-sm font-bold text-white tabular-nums">
              {formatCurrency(monthly)}
            </span>
          </div>

          <ExportButton subscriptions={subscriptions} />

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Impact phrase */}
        <ImpactPhrases subscriptions={subscriptions} />

        {/* Stats */}
        <section>
          <StatsCards subscriptions={subscriptions} />
        </section>

        {/* Charts */}
        <section>
          <CategoryChart subscriptions={subscriptions} />
        </section>

        {/* Main content: subscriptions + renewals */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter + search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Search size={15} style={{ color: "#475569" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar en tus suscripciones..."
                  aria-label="Buscar en tus suscripciones"
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#334155]"
                />
              </div>
            </div>

            <FilterBar selected={filter} onChange={setFilter} />

            {/* List header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Suscripciones{" "}
                <span
                  className="text-xs font-normal ml-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}
                >
                  {filtered.length}
                </span>
              </h2>
              {filter !== "all" || search ? (
                <button
                  onClick={() => { setFilter("all"); setSearch(""); }}
                  className="text-xs cursor-pointer transition-colors"
                  style={{ color: "#7c3aed" }}
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div
                  className="text-center py-16 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-sm font-medium text-white mb-1">
                    {subscriptions.length === 0
                      ? "No tienes suscripciones aún"
                      : "Sin resultados"}
                  </p>
                  <p className="text-xs mb-5" style={{ color: "#475569" }}>
                    {subscriptions.length === 0
                      ? "Añade tu primera suscripción para empezar"
                      : "Prueba con otro filtro o búsqueda"}
                  </p>
                  {subscriptions.length === 0 && (
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={handleAdd}
                        className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                      >
                        Añadir suscripción
                      </button>
                      <button
                        onClick={() => setSubscriptions(loadDemoSubscriptions())}
                        className="text-sm font-medium px-5 py-2.5 rounded-xl cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#94a3b8",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        Cargar ejemplos
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                filtered.map((sub) => (
                  <div key={sub.id} className="relative">
                    <SubscriptionCard
                      subscription={sub}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                    {deleteConfirm === sub.id && (
                      <div
                        className="absolute inset-0 rounded-2xl flex items-center justify-center gap-3 animate-fade-in"
                        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                      >
                        <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>
                          ¿Eliminar {sub.name}?
                        </p>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-sm font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                          style={{ background: "#ef4444", color: "white" }}
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-sm px-3 py-1.5 rounded-lg cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.1)", color: "#94a3b8" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Renewals sidebar */}
          <div className="space-y-4">
            <RenewalList subscriptions={subscriptions} />

            {/* Quick summary card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(16,185,129,0.05) 100%)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <p className="text-xs font-medium mb-4" style={{ color: "#06b6d4" }}>
                Resumen financiero
              </p>
              <div className="space-y-3">
                <Row
                  label="Gasto mensual"
                  value={formatCurrency(getTotalMonthly(subscriptions))}
                  color="#a78bfa"
                />
                <Row
                  label="Gasto anual"
                  value={formatCurrency(getTotalMonthly(subscriptions) * 12)}
                  color="#06b6d4"
                />
                <Row
                  label="Gasto diario"
                  value={formatCurrency(getTotalMonthly(subscriptions) / 30)}
                  color="#10b981"
                />
                <div
                  className="border-t pt-3"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <Row
                    label="Nº suscripciones"
                    value={String(subscriptions.length)}
                    color="#f59e0b"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <SubscriptionModal
        key={`${editing?.id ?? "new"}-${modalOpen ? "open" : "closed"}`}
        open={modalOpen}
        subscription={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
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
