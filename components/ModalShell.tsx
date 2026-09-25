"use client";

import { X } from "lucide-react";

interface Props {
  title: string;
  kicker: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Ventana modal con forma de tique: borde inferior rasgado y cabecera de caja.
export default function ModalShell({ title, kicker, onClose, children }: Props) {
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-[2px]"
      onClick={handleBackdropClick}
    >
      <div className="receipt-shadow w-full max-w-md animate-fade-in-up" role="dialog" aria-modal="true" aria-label={title}>
        <div className="receipt-edge-b bg-paper-2 pb-6">
          <div className="flex items-start justify-between gap-4 border-b-[1.5px] border-ink bg-ink px-6 py-5 text-paper-2">
            <div>
              <p className="label-mono text-paper-2/60">{kicker}</p>
              <h2
                className="mt-1 font-display text-2xl font-extrabold leading-none tracking-tight"
                style={{ fontVariationSettings: '"wdth" 85' }}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 cursor-pointer items-center justify-center border-[1.5px] border-paper-2/40 transition-colors hover:border-paper-2 hover:bg-paper-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono text-ink-soft">
        {label} {hint && <span className="normal-case tracking-normal text-ink-faint">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block font-mono text-xs text-stamp">{error}</span>}
    </label>
  );
}
