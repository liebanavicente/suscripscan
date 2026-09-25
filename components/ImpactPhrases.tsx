"use client";

import { useEffect, useState } from "react";
import { Subscription } from "@/lib/types";
import { getImpactPhrases } from "@/lib/calculations";

export default function ImpactPhrases({ subscriptions }: { subscriptions: Subscription[] }) {
  const [index, setIndex] = useState(0);
  const phrases = getImpactPhrases(subscriptions);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  if (!phrases.length) return null;

  return (
    <div className="card flex flex-col gap-4 overflow-hidden p-0 sm:flex-row sm:items-stretch">
      <div className="flex items-center gap-3 bg-stamp px-5 py-3 text-paper-2 sm:w-44 sm:flex-col sm:items-start sm:justify-between sm:py-5">
        <span className="label-mono">Dato de impacto</span>
        <span className="font-mono text-xs opacity-80 tabular-nums">
          {String(index + 1).padStart(2, "0")}/{String(phrases.length).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 px-5 pb-5 sm:py-5 sm:pl-2 sm:pr-6">
        <p
          key={index}
          className="animate-fade-in font-display text-xl font-semibold leading-snug tracking-tight sm:text-2xl"
        >
          {phrases[index]}
        </p>
        {phrases.length > 1 && (
          <div className="flex gap-1.5">
            {phrases.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ver dato ${i + 1}`}
                className="h-1.5 cursor-pointer border border-ink transition-all"
                style={{
                  width: i === index ? 28 : 10,
                  background: i === index ? "var(--color-ink)" : "transparent",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
