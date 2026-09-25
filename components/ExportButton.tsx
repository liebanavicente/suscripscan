"use client";

import { useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown, Database, Upload } from "lucide-react";
import { Expense, Subscription } from "@/lib/types";
import { exportToCSV, exportToPDF, exportToJSON, importFromJSON, ImportResult } from "@/lib/export";

interface Props {
  subscriptions: Subscription[];
  expenses: Expense[];
  onImport: (result: ImportResult) => void;
}

export default function ExportButton({ subscriptions, expenses, onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"csv" | "pdf" | "json" | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  function handleJSON() {
    setLoading("json");
    exportToJSON(subscriptions, expenses);
    setLoading(null);
    setOpen(false);
  }

  function handleImportClick() {
    setOpen(false);
    setImportError(null);
    fileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importFromJSON(file);
      onImport(result);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Error al importar");
      setTimeout(() => setImportError(null), 4000);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

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
        <span className="hidden sm:inline">Datos</span>
        <ChevronDown size={13} style={{ opacity: 0.6 }} />
      </button>

      {importError && (
        <div
          className="absolute right-0 top-full mt-2 z-50 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
        >
          {importError}
        </div>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden animate-fade-in"
            style={{
              background: "#18181f",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              minWidth: 200,
            }}
          >
            {/* Import */}
            <button
              onClick={handleImportClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer"
              style={{ color: "#e2e8f0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,0.14)" }}>
                <Upload size={14} style={{ color: "#a7f3d0" }} />
              </div>
              <div>
                <p className="font-medium">Importar backup</p>
                <p className="text-xs" style={{ color: "#475569" }}>Restaurar desde .json</p>
              </div>
            </button>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

            {/* JSON backup — only if there's data */}
            {subscriptions.length > 0 && (
              <>
                <button
                  onClick={handleJSON}
                  disabled={loading === "json"}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer"
                  style={{ color: "#e2e8f0" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(248,216,137,0.13)" }}>
                    <Database size={14} style={{ color: "#f8d889" }} />
                  </div>
                  <div>
                    <p className="font-medium">{loading === "json" ? "Guardando..." : "Guardar backup"}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>Descarga tus datos (.json)</p>
                  </div>
                </button>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

                <button
                  onClick={handleCSV}
                  disabled={loading === "csv"}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer"
                  style={{ color: "#e2e8f0" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
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
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>
                    <FileText size={14} style={{ color: "#ef4444" }} />
                  </div>
                  <div>
                    <p className="font-medium">{loading === "pdf" ? "Generando..." : "Exportar PDF"}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>Informe completo</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
