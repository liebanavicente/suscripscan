"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
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
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.08) 100%)",
        border: "1px solid rgba(124,58,237,0.25)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent)",
          filter: "blur(20px)",
        }}
      />

      <div className="flex items-start gap-3 relative">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(167,139,250,0.2)" }}
        >
          <Lightbulb size={15} style={{ color: "#a78bfa" }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: "#7c3aed" }}>
            Dato de impacto
          </p>
          <p
            key={index}
            className="text-sm font-medium text-white animate-fade-in"
            style={{ lineHeight: 1.5 }}
          >
            {phrases[index]}
          </p>
          {phrases.length > 1 && (
            <div className="flex gap-1 mt-3">
              {phrases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="h-1 rounded-full transition-all cursor-pointer"
                  style={{
                    width: i === index ? 20 : 6,
                    background: i === index ? "#a78bfa" : "rgba(167,139,250,0.3)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
