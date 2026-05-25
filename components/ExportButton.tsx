"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Subscription } from "@/lib/types";
import { exportToCSV, exportToPDF } from "@/lib/export";

export default function ExportButton({ subscriptions }: { subscriptions: Subscription[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"csv" | "pdf" | null>(null);

  async function handleCSV() {
    setLoading("csv");
    exportToCSV(subscriptions);
    setLoading(null);
    setOpen(false);
  }

  async function handlePDF() {
    setLoading("pdf");
    await exportToPDF(subscriptions);
    setLoading(null);
    setOpen(false);
  }

  if (!subscriptions.length) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "#94a3b8",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#e2e8f0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        <Download size={15} />
        <span className="hidden sm:inline">Exportar</span>
        <ChevronDown size={13} style={{ opacity: 0.6 }} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden animate-fade-in"
            style={{
              background: "#18181f",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              minWidth: 180,
            }}
          >
            <button
              onClick={handleCSV}
              disabled={loading === "csv"}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer"
              style={{ color: "#e2e8f0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                <FileSpreadsheet size={14} style={{ color: "#10b981" }} />
              </div>
              <div>
                <p className="font-medium">{loading === "csv" ? "Generando..." : "Exportar CSV"}</p>
                <p className="text-xs" style={{ color: "#475569" }}>Excel / Google Sheets</p>
              </div>
            </button>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

            <button
              onClick={handlePDF}
              disabled={loading === "pdf"}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer"
              style={{ color: "#e2e8f0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(239,68,68,0.15)" }}
              >
                <FileText size={14} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <p className="font-medium">{loading === "pdf" ? "Generando..." : "Exportar PDF"}</p>
                <p className="text-xs" style={{ color: "#475569" }}>Informe completo</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
