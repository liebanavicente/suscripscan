import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Suscripscan — Controla tus suscripciones",
  description:
    "Descubre cuánto gastas realmente al mes en suscripciones digitales y servicios recurrentes.",
  keywords: ["suscripciones", "finanzas personales", "gastos digitales"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`h-full ${bricolage.variable} ${dmMono.variable}`}>
      <body className="min-h-full flex flex-col paper-bg">{children}</body>
    </html>
  );
}
