import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
