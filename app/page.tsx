import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import Barcode from "@/components/Barcode";

const features = [
  {
    n: "01",
    title: "Lo lee todo junto",
    description:
      "Mensual, trimestral o anual: Suscripscan lo pasa todo a lo que de verdad te cuesta cada mes, cada año y cada día.",
  },
  {
    n: "02",
    title: "Te avisa antes del cobro",
    description:
      "Un calendario de renovaciones y una lista de próximos cargos para que ningún cobro te pille por sorpresa.",
  },
  {
    n: "03",
    title: "Tus datos no salen de aquí",
    description:
      "Todo vive en tu navegador. Sin cuentas, sin servidores, sin sincronizaciones raras. Exporta o haz backup cuando quieras.",
  },
];

const receiptLines = [
  { name: "NETFLIX", price: "17,99" },
  { name: "SPOTIFY", price: "11,99" },
  { name: "CHATGPT PLUS", price: "20,00" },
  { name: "DISNEY+", price: "11,99" },
  { name: "ICLOUD+ 50GB", price: "2,99" },
  { name: "ADOBE CC", price: "59,99", flagged: true },
  { name: "XBOX GAME PASS", price: "14,99" },
];

const ticker = [
  "Netflix 17,99€",
  "Spotify 11,99€",
  "ChatGPT Plus 20,00€",
  "Movistar 45,00€",
  "Adobe CC 59,99€",
  "iCloud+ 2,99€",
  "Disney+ 11,99€",
  "Xbox Game Pass 14,99€",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-ink">
      <header className="px-5 sm:px-6">
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between">
          <BrandMark size="md" />
          <Link href="/dashboard" className="btn btn-ghost">
            Mi tique
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-10">
          <div>
            <p className="label-mono mb-6 flex items-center gap-3 text-ink-soft">
              <span className="inline-block h-2 w-2 rounded-full bg-stamp" />
              Escáner de gastos recurrentes · 100% local
            </p>

            <h1
              className="font-display text-[3.2rem] font-extrabold leading-[0.92] tracking-[-0.035em] sm:text-7xl lg:text-[5.6rem]"
              style={{ fontVariationSettings: '"wdth" 82, "opsz" 96' }}
            >
              Todo lo que pagas{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">sin mirar</span>
                <span className="absolute inset-x-[-0.08em] bottom-[0.08em] top-[0.52em] -z-0 -rotate-1 bg-marker" />
              </span>
              , en un solo tique.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-soft">
              Suscripscan escanea tus suscripciones y te devuelve la cuenta
              completa: cuánto se va cada mes, qué se renueva pronto y qué
              deberías cancelar ya.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className="btn btn-primary h-12 px-6 text-base">
                Escanear mis gastos
                <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard?demo=true" className="btn btn-ghost h-12 px-6 text-base">
                Ver un tique de ejemplo
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 border-y-[1.5px] border-ink">
              {[
                ["Al mes", "184,94€"],
                ["Al año", "2.219€"],
                ["Al día", "6,16€"],
              ].map(([label, value], i) => (
                <div key={label} className={`py-4 ${i > 0 ? "border-l-[1.5px] border-dashed border-ink/40 pl-4" : ""}`}>
                  <dt className="label-mono text-ink-faint">{label}</dt>
                  <dd className="mt-1 font-mono text-xl font-medium tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* El tique */}
          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute -left-10 top-10 hidden h-[88%] w-full -rotate-3 bg-paper-3 lg:block" aria-hidden />
            <div className="receipt-shadow relative rotate-[1.5deg]">
              <div
                className="receipt-edge-y scan-zone animate-print bg-paper-2 px-7 pb-10 pt-9 font-mono text-[13px] text-ink"
                style={{ ["--scan-distance" as string]: "560px" }}
              >
                <div className="text-center">
                  <p className="font-display text-2xl font-extrabold tracking-tight" style={{ fontVariationSettings: '"wdth" 85' }}>
                    SUSCRIPSCAN
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                    Tique de gastos recurrentes
                  </p>
                  <p className="mt-3 text-[11px] text-ink-faint">CAJA 01 · TERMINAL LOCAL · SIN SERVIDOR</p>
                </div>

                <hr className="rule-dashed my-5" />

                <ul className="space-y-2">
                  {receiptLines.map((line) => (
                    <li key={line.name} className="leader">
                      <span className={line.flagged ? "marker" : ""}>{line.name}</span>
                      <span className="leader-fill" />
                      <span className="tabular-nums">{line.price}</span>
                    </li>
                  ))}
                </ul>

                <hr className="rule-dashed my-5" />

                <div className="space-y-1.5">
                  <div className="leader text-ink-soft">
                    <span>SUBTOTAL MES</span>
                    <span className="leader-fill" />
                    <span className="tabular-nums">139,94</span>
                  </div>
                  <div className="leader text-ink-soft">
                    <span>MOVISTAR FIBRA</span>
                    <span className="leader-fill" />
                    <span className="tabular-nums">45,00</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-y-2 border-ink py-3">
                  <span className="text-base font-medium">TOTAL / MES</span>
                  <span className="font-display text-3xl font-extrabold tabular-nums tracking-tight">
                    184,94€
                  </span>
                </div>
                <div className="leader mt-2 text-ink-soft">
                  <span>PROYECCIÓN ANUAL</span>
                  <span className="leader-fill" />
                  <span className="tabular-nums">2.219,28€</span>
                </div>

                <div className="relative mt-7 min-h-16">
                  <p className="max-w-[60%] text-[11px] leading-relaxed text-ink-soft">
                    * Adobe CC supone el 32% del total. Revisar antes del día 25.
                  </p>
                  <span className="stamp animate-stamp absolute -top-2 right-0 text-sm" style={{ animationDelay: "1.5s" }}>
                    ¡Revisar!
                  </span>
                </div>

                <Barcode value="0184 94 2219" className="mt-6 text-ink" height={46} />
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Gracias por no olvidar nada
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cinta */}
        <div className="overflow-hidden border-y-[1.5px] border-ink bg-ink py-3 text-paper-2" aria-hidden>
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.18em]">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span className="text-stamp">✕</span>
              </span>
            ))}
          </div>
        </div>

        <section className="px-5 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2
                className="max-w-2xl font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-5xl"
                style={{ fontVariationSettings: '"wdth" 85' }}
              >
                Menos sustos a final de mes.
              </h2>
              <p className="label-mono text-ink-faint">Cómo funciona</p>
            </div>

            <div className="grid grid-cols-1 border-t-[1.5px] border-ink md:grid-cols-3">
              {features.map((feature, i) => (
                <article
                  key={feature.n}
                  className={`py-8 md:px-8 ${i === 0 ? "md:pl-0" : "border-t-[1.5px] border-dashed border-ink/40 md:border-l-[1.5px] md:border-t-0"}`}
                >
                  <p className="font-mono text-sm text-stamp">{feature.n}</p>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-ink-soft">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-[1.5px] border-ink px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <BrandMark size="sm" />
          <p className="label-mono text-ink-faint">Tus datos se quedan en tu dispositivo</p>
        </div>
      </footer>
    </div>
  );
}
