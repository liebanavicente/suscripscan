"use client";

import { Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

interface Props {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

export default function FilterBar({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className="h-9 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer flex-shrink-0"
        style={{
          background: selected === "all" ? "#34d399" : "rgba(255,255,255,0.05)",
          color: selected === "all" ? "white" : "#64748b",
          border: selected === "all" ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.08)",
        }}
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
            className="w-9 h-9 rounded-xl text-base transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive ? `${meta.color}22` : "rgba(255,255,255,0.05)",
              border: isActive
                ? `1px solid ${meta.color}50`
                : "1px solid rgba(255,255,255,0.08)",
              filter: isActive ? "none" : "grayscale(0.3) opacity(0.7)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            {meta.icon}
          </button>
        );
      })}
    </div>
  );
}
