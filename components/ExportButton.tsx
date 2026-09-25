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
        aria-expanded={open}
        className="btn btn-ghost px-3"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Datos</span>
        <ChevronDown size={13} className="opacity-60" />
      </button>

      {importError && (
        <div className="stamp absolute right-0 top-full z-50 mt-3 whitespace-nowrap bg-paper-2 text-xs">
          {importError}
        </div>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="card animate-fade-in absolute right-0 top-full z-50 mt-3 min-w-[230px] divide-y-[1.5px] divide-dashed divide-ink/25">
            <MenuItem
              icon={<Upload size={14} />}
              title="Importar backup"
              subtitle="Restaurar desde .json"
              onClick={handleImportClick}
            />

            {subscriptions.length > 0 && (
              <>
                <MenuItem
                  icon={<Database size={14} />}
                  title={loading === "json" ? "Guardando..." : "Guardar backup"}
                  subtitle="Descarga tus datos (.json)"
                  onClick={handleJSON}
                  disabled={loading === "json"}
                />
                <MenuItem
                  icon={<FileSpreadsheet size={14} />}
                  title={loading === "csv" ? "Generando..." : "Exportar CSV"}
                  subtitle="Excel / Google Sheets"
                  onClick={handleCSV}
                  disabled={loading === "csv"}
                />
                <MenuItem
                  icon={<FileText size={14} />}
                  title={loading === "pdf" ? "Generando..." : "Exportar PDF"}
                  subtitle="Informe completo"
                  onClick={handlePDF}
                  disabled={loading === "pdf"}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-marker disabled:opacity-60"
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center border-[1.5px] border-ink">
        {icon}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block font-mono text-[11px] text-ink-faint">{subtitle}</span>
      </span>
    </button>
  );
}
