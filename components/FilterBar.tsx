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
        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
        style={{
          background: selected === "all" ? "#7c3aed" : "rgba(255,255,255,0.05)",
          color: selected === "all" ? "white" : "#64748b",
          border: selected === "all" ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
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
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            style={{
              background: isActive ? `${meta.color}20` : "rgba(255,255,255,0.05)",
              color: isActive ? meta.color : "#64748b",
              border: isActive
                ? `1px solid ${meta.color}50`
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span>{meta.icon}</span>
            <span className="hidden sm:inline">
              {meta.label.split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
