import { Subscription } from "./types";
import { CATEGORY_META, FREQUENCY_LABELS } from "./constants";
import {
  toMonthlyPrice,
  toAnnualPrice,
  getTotalMonthly,
  getTotalAnnual,
  formatCurrency,
} from "./calculations";

// ─── CSV ──────────────────────────────────────────────────────────────────────

export function exportToCSV(subscriptions: Subscription[]): void {
  const headers = [
    "Nombre",
    "Categoría",
    "Precio original",
    "Frecuencia",
    "Precio mensual",
    "Precio anual",
    "Próxima renovación",
  ];

  const rows = subscriptions.map((s) => [
    s.name,
    CATEGORY_META[s.category].label,
    `${s.price.toFixed(2)} €`,
    FREQUENCY_LABELS[s.frequency],
    `${toMonthlyPrice(s).toFixed(2)} €`,
    `${toAnnualPrice(s).toFixed(2)} €`,
    s.renewalDate,
  ]);

  const totalMonthly = getTotalMonthly(subscriptions);
  const totalAnnual = getTotalAnnual(subscriptions);

  rows.push([]);
  rows.push(["TOTAL", "", "", "", `${totalMonthly.toFixed(2)} €`, `${totalAnnual.toFixed(2)} €`, ""]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `suscripscan_${dateStamp()}.csv`);
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

export async function exportToPDF(subscriptions: Subscription[]): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const purple = [124, 58, 237] as [number, number, number];
  const darkBg = [15, 15, 25] as [number, number, number];
  const white = [255, 255, 255] as [number, number, number];
  const muted = [100, 116, 139] as [number, number, number];
  const light = [226, 232, 240] as [number, number, number];

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, "F");

  // Header bar
  doc.setFillColor(...purple);
  doc.rect(0, 0, 210, 28, "F");

  // Title
  doc.setTextColor(...white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Suscripscan", 14, 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 180, 255);
  doc.text("Informe de suscripciones digitales", 14, 20);

  const dateStr = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(...white);
  doc.text(dateStr, 196, 16, { align: "right" });

  // Summary cards
  const monthly = getTotalMonthly(subscriptions);
  const annual = getTotalAnnual(subscriptions);
  const daily = monthly / 30;

  const cards = [
    { label: "Gasto mensual", value: formatCurrency(monthly) },
    { label: "Gasto anual", value: formatCurrency(annual) },
    { label: "Gasto diario", value: formatCurrency(daily) },
    { label: "Suscripciones", value: String(subscriptions.length) },
  ];

  cards.forEach((card, i) => {
    const x = 14 + i * 46;
    const y = 34;
    doc.setFillColor(30, 30, 45);
    doc.roundedRect(x, y, 42, 20, 3, 3, "F");
    doc.setTextColor(...muted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(card.label, x + 4, y + 7);
    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, x + 4, y + 15);
  });

  // Table
  const tableRows = subscriptions.map((s) => [
    s.name,
    `${CATEGORY_META[s.category].icon} ${CATEGORY_META[s.category].label}`,
    `${s.price.toFixed(2)} €`,
    FREQUENCY_LABELS[s.frequency],
    `${toMonthlyPrice(s).toFixed(2)} €`,
    `${toAnnualPrice(s).toFixed(2)} €`,
    s.renewalDate,
  ]);

  autoTable(doc, {
    startY: 62,
    head: [["Servicio", "Categoría", "Precio", "Frecuencia", "Mensual", "Anual", "Renovación"]],
    body: tableRows,
    foot: [["", "", "", "TOTAL", `${monthly.toFixed(2)} €`, `${annual.toFixed(2)} €`, ""]],
    styles: {
      fillColor: [20, 20, 32],
      textColor: light,
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: purple,
      textColor: white,
      fontStyle: "bold",
      fontSize: 8,
    },
    footStyles: {
      fillColor: [30, 30, 50],
      textColor: white,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [25, 25, 40],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35 },
      1: { cellWidth: 45 },
      4: { textColor: [167, 139, 250] as [number, number, number] },
      5: { textColor: [6, 182, 212] as [number, number, number] },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageH = doc.internal.pageSize.height;
  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Generado por Suscripscan · suscripscan.vercel.app", 105, pageH - 6, { align: "center" });

  doc.save(`suscripscan_${dateStamp()}.pdf`);
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function dateStamp(): string {
  return new Date().toISOString().split("T")[0];
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
