"use client";

import { Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

export default function FilterBar({ selected, onChange }: Props) {
  const base =
    "h-9 cursor-pointer border-[1.5px] border-ink transition-all flex items-center justify-center flex-shrink-0";
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`${base} label-mono px-3 ${
          selected === "all" ? "bg-ink text-paper-2" : "bg-paper-2 text-ink hover:bg-marker"
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        const meta = CATEGORY_META[cat];
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            title={meta.label}
            aria-label={meta.label}
            aria-pressed={isActive}
            className={`${base} w-9 text-base ${isActive ? "-translate-y-0.5" : "bg-paper-2 hover:bg-marker"}`}
            style={
              isActive
                ? { background: meta.color, boxShadow: "2px 2px 0 var(--color-ink)" }
                : undefined
            }
          >
            {meta.icon}
          </button>
        );
      })}
    </div>
  );
}
