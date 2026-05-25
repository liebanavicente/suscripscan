import Link from "next/link";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: <BarChart2 size={22} style={{ color: "#a78bfa" }} />,
    title: "Dashboard visual",
    description:
      "Gráficos interactivos que muestran exactamente a dónde va tu dinero cada mes.",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    icon: <Zap size={22} style={{ color: "#06b6d4" }} />,
    title: "Insights de impacto",
    description:
      "Frases que te hacen consciente del coste real de tus suscripciones digitales.",
    bg: "rgba(6,182,212,0.12)",
  },
  {
    icon: <Shield size={22} style={{ color: "#10b981" }} />,
    title: "100% privado",
    description:
      "Tus datos se guardan solo en tu dispositivo. Sin cuentas, sin servidores.",
    bg: "rgba(16,185,129,0.12)",
  },
];

const exampleSubs = [
  { name: "Netflix", price: "17,99€", icon: "📺" },
  { name: "Spotify", price: "11,99€", icon: "🎵" },
  { name: "ChatGPT Plus", price: "20,00€", icon: "🤖" },
  { name: "Disney+", price: "11,99€", icon: "📺" },
  { name: "iCloud+", price: "2,99€", icon: "☁️" },
  { name: "Adobe CC", price: "59,99€", icon: "💻" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen hero-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-bold text-white text-lg">Suscripscan</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto w-full">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 animate-fade-in-up"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Controla tu gasto digital
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "100ms", opacity: 0 }}
        >
          ¿Sabes cuánto
          <br />
          <span className="gradient-text">gastas al mes</span>
          <br />
          en suscripciones?
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mb-10 animate-fade-in-up"
          style={{ color: "#64748b", animationDelay: "200ms", opacity: 0 }}
        >
          Suscripscan te ayuda a descubrir el coste real de todos tus servicios
          recurrentes. Añade tus suscripciones y descubre el impacto en tu
          bolsillo.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
          style={{ animationDelay: "300ms", opacity: 0 }}
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
            }}
          >
            Empezar ahora
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-base transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Ver demo con ejemplos
          </Link>
        </div>

        {/* Floating subscription pills */}
        <div
          className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "400ms", opacity: 0 }}
        >
          {exampleSubs.map((sub, i) => (
            <div
              key={sub.name}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
                animationDelay: `${400 + i * 60}ms`,
              }}
            >
              <span>{sub.icon}</span>
              <span>{sub.name}</span>
              <span className="font-semibold" style={{ color: "#a78bfa" }}>
                {sub.price}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 animate-fade-in-up"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                animationDelay: `${500 + i * 100}ms`,
                opacity: 0,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: "#475569" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8" style={{ color: "#334155" }}>
        <p className="text-xs">
          Suscripscan — Tus datos son solo tuyos, guardados en tu dispositivo
        </p>
      </footer>
    </div>
  );
}
