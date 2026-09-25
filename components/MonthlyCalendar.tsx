"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Expense, Subscription } from "@/lib/types";
import { getRenewalsForMonth, formatCurrency, toMonthlyPrice } from "@/lib/calculations";
import { CATEGORY_META, EXPENSE_CATEGORY_META } from "@/lib/constants";
import { parseLocalISODate } from "@/lib/dates";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface Props {
  subscriptions: Subscription[];
  expenses: Expense[];
}

export default function MonthlyCalendar({ subscriptions, expenses }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const renewals = getRenewalsForMonth(subscriptions, year, month);

  // Map expenses to days for this month
  const expensesByDay = new Map<number, Expense[]>();
  for (const exp of expenses) {
    const d = parseLocalISODate(exp.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      expensesByDay.set(day, [...(expensesByDay.get(day) ?? []), exp]);
    }
  }

  const firstDow = new Date(year, month, 1).getDay();
  const offset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  const selectedSubs = selectedDay ? (renewals.get(selectedDay) ?? []) : [];
  const selectedExps = selectedDay ? (expensesByDay.get(selectedDay) ?? []) : [];
  const selectedSubsTotal = selectedSubs.reduce((acc, s) => acc + toMonthlyPrice(s), 0);
  const selectedExpsTotal = selectedExps.reduce((acc, e) => acc + e.amount, 0);

  const totalSubsMonth = Array.from(renewals.values()).flat().reduce((acc, s) => acc + toMonthlyPrice(s), 0);
  const totalExpsMonth = Array.from(expensesByDay.values()).flat().reduce((acc, e) => acc + e.amount, 0);

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div>
          <h2 className="text-sm font-semibold text-white">
            {MONTH_NAMES[month]} {year}
          </h2>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs" style={{ color: "#64748b" }}>
              Suscripciones <span style={{ color: "#a7f3d0" }}>{formatCurrency(totalSubsMonth)}</span>
            </span>
            {totalExpsMonth > 0 && (
              <span className="text-xs" style={{ color: "#64748b" }}>
                · Gastos <span style={{ color: "#34d399" }}>{formatCurrency(totalExpsMonth)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{ color: "#475569" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(null); }}
            className="px-3 h-8 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            style={{ color: "#a7f3d0", background: "rgba(52,211,153,0.1)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.16)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.1)"; }}
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{ color: "#475569" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium py-2" style={{ color: "#334155" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const daySubs = renewals.get(day) ?? [];
            const dayExps = expensesByDay.get(day) ?? [];
            const subsTotal = daySubs.reduce((acc, s) => acc + toMonthlyPrice(s), 0);
            const expsTotal = dayExps.reduce((acc, e) => acc + e.amount, 0);
            const dayTotal = subsTotal + expsTotal;
            const hasActivity = daySubs.length > 0 || dayExps.length > 0;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className="relative flex flex-col items-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[56px]"
                style={{
                  background: isSelected
                    ? "rgba(52,211,153,0.16)"
                    : hasActivity
                    ? "rgba(255,255,255,0.04)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(52,211,153,0.42)"
                    : isToday(day)
                    ? "1px solid rgba(52,211,153,0.28)"
                    : "1px solid transparent",
                }}
              >
                <span
                  className="text-xs font-medium tabular-nums leading-none mb-1"
                  style={{ color: isToday(day) ? "#a7f3d0" : hasActivity ? "#e2e8f0" : "#475569" }}
                >
                  {day}
                </span>

                {/* Dots row: round=subscription, square=expense */}
                {hasActivity && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {daySubs.slice(0, 2).map((sub, idx) => (
                      <span
                        key={`s${idx}`}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_META[sub.category].color }}
                      />
                    ))}
                    {dayExps.slice(0, 2).map((exp, idx) => (
                      <span
                        key={`e${idx}`}
                        className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                        style={{ background: EXPENSE_CATEGORY_META[exp.category].color }}
                      />
                    ))}
                    {daySubs.length + dayExps.length > 4 && (
                      <span className="text-[9px] leading-none" style={{ color: "#64748b" }}>
                        +{daySubs.length + dayExps.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {hasActivity && (
                  <span
                    className="text-[9px] font-medium tabular-nums mt-0.5 leading-none"
                    style={{ color: "#64748b" }}
                  >
                    {formatCurrency(dayTotal)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 px-5 pb-4"
        style={{ color: "#475569" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#34d399" }} />
          <span className="text-xs">Suscripción</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "#10b981" }} />
          <span className="text-xs">Gasto</span>
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDay && (selectedSubs.length > 0 || selectedExps.length > 0) && (
        <div
          className="mx-4 mb-4 rounded-xl overflow-hidden"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(52,211,153,0.15)" }}
          >
            <p className="text-xs font-semibold text-white">
              {selectedDay} de {MONTH_NAMES[month]}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tabular-nums" style={{ color: "#a7f3d0" }}>
                {formatCurrency(selectedSubsTotal + selectedExpsTotal)}
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                style={{ color: "#475569" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {selectedSubs.map(sub => (
              <div key={sub.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-base leading-none">{CATEGORY_META[sub.category].icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{sub.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#64748b" }}>
                    Suscripción · {CATEGORY_META[sub.category].label}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums flex-shrink-0" style={{ color: "#e2e8f0" }}>
                  {formatCurrency(toMonthlyPrice(sub))}
                </span>
              </div>
            ))}
            {selectedExps.map(exp => (
              <div key={exp.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-base leading-none">{EXPENSE_CATEGORY_META[exp.category].icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{exp.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#64748b" }}>
                    Gasto · {EXPENSE_CATEGORY_META[exp.category].label}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums flex-shrink-0" style={{ color: "#34d399" }}>
                  {formatCurrency(exp.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
