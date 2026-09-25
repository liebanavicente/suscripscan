import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  WalletCards,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";

const features = [
  {
    icon: <BarChart3 size={20} />,
    title: "Lectura financiera clara",
    description:
      "Visualiza gasto mensual, anual y diario con una jerarquía pensada para decidir rápido.",
  },
  {
    icon: <CalendarClock size={20} />,
    title: "Renovaciones bajo control",
    description:
      "Anticipa cobros próximos y detecta servicios que ya no justifican su coste.",
  },
  {
    icon: <LockKeyhole size={20} />,
    title: "Privacidad local",
    description:
      "Tus datos viven en tu dispositivo. Sin cuentas, sincronización forzada ni servidores externos.",
  },
];

const exampleSubs = [
  { name: "Netflix", price: "17,99€", status: "Sube en 5 días" },
  { name: "Spotify", price: "11,99€", status: "Activo" },
  { name: "ChatGPT Plus", price: "20,00€", status: "Esencial" },
  { name: "iCloud+", price: "2,99€", status: "Bajo impacto" },
];

const totals = [
  { label: "Mes", value: "64,96€" },
  { label: "Año", value: "779,52€" },
  { label: "Ahorro detectado", value: "18%" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen premium-bg text-white">
      <header className="px-5 py-4 sm:px-6">
        <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
          <BrandMark size="sm" />
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-14 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:pb-20">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <Sparkles size={14} />
              Inteligencia tranquila para gastos recurrentes
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Tus suscripciones, con criterio premium.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Suscripscan convierte tus pagos recurrentes en una vista clara,
              privada y accionable para saber qué mantener, qué renegociar y qué
              cancelar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
              >
                Empezar ahora
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/dashboard?demo=true"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                Ver demo con ejemplos
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {totals.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="product-frame mx-auto max-w-xl rounded-xl border border-white/10 bg-[#101318]/95 p-3 shadow-2xl shadow-black/40">
              <div className="rounded-lg border border-white/10 bg-[#0b0d11] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <BrandMark size="sm" />
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                    Demo privada
                  </div>
                </div>

                <div className="grid gap-3 py-5 sm:grid-cols-3">
                  {totals.map((item) => (
                    <div key={item.label} className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-[11px] uppercase text-slate-500">{item.label}</p>
                      <p className="mt-2 text-xl font-semibold tabular-nums">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Cartera digital</p>
                      <p className="text-xs text-slate-500">4 servicios monitorizados</p>
                    </div>
                    <WalletCards size={19} className="text-emerald-200" />
                  </div>
                  <div className="space-y-2">
                    {exampleSubs.map((sub) => (
                      <div
                        key={sub.name}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.035] px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{sub.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{sub.status}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums text-emerald-200">
                          {sub.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
                  <CheckCircle2 size={17} />
                  Puedes ahorrar 140€ al año revisando dos servicios.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-black/10 px-5 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                  {feature.icon}
                </div>
                <h2 className="text-base font-semibold text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-7 text-center text-xs text-slate-600 sm:px-6">
        Suscripscan guarda tus datos solo en tu dispositivo.
      </footer>
    </div>
  );
}
