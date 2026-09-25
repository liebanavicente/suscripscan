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
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b-[1.5px] border-ink px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-mono text-ink-faint">Calendario de cobros</p>
          <h2
            className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight"
            style={{ fontVariationSettings: '"wdth" 85' }}
          >
            {MONTH_NAMES[month]} <span className="text-ink-faint">{year}</span>
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex gap-5 font-mono text-xs">
            <div>
              <p className="label-mono text-ink-faint">Suscr.</p>
              <p className="mt-0.5 text-sm font-medium tabular-nums">{formatCurrency(totalSubsMonth)}</p>
            </div>
            {totalExpsMonth > 0 && (
              <div>
                <p className="label-mono text-ink-faint">Gastos</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-carbon">{formatCurrency(totalExpsMonth)}</p>
              </div>
            )}
          </div>
          <div className="flex items-center border-[1.5px] border-ink">
            <button
              onClick={prevMonth}
              aria-label="Mes anterior"
              className="flex h-8 w-8 cursor-pointer items-center justify-center transition-colors hover:bg-marker"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(null); }}
              className="label-mono h-8 cursor-pointer border-x-[1.5px] border-ink px-3 transition-colors hover:bg-marker"
            >
              Hoy
            </button>
            <button
              onClick={nextMonth}
              aria-label="Mes siguiente"
              className="flex h-8 w-8 cursor-pointer items-center justify-center transition-colors hover:bg-marker"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-2 pb-2 sm:px-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map(d => (
            <div key={d} className="label-mono py-2.5 text-center text-ink-faint">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 border-l border-t border-ink/15">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="border-b border-r border-ink/15 bg-paper/60" />;
            const daySubs = renewals.get(day) ?? [];
            const dayExps = expensesByDay.get(day) ?? [];
            const subsTotal = daySubs.reduce((acc, s) => acc + toMonthlyPrice(s), 0);
            const expsTotal = dayExps.reduce((acc, e) => acc + e.amount, 0);
            const dayTotal = subsTotal + expsTotal;
            const hasActivity = daySubs.length > 0 || dayExps.length > 0;
            const isSelected = selectedDay === day;
            const todayCell = isToday(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative flex min-h-[64px] cursor-pointer flex-col items-start justify-between border-b border-r border-ink/15 p-1.5 text-left transition-colors sm:min-h-[76px] sm:p-2 ${
                  isSelected ? "bg-ink text-paper-2" : hasActivity ? "hover:bg-marker/40" : "hover:bg-paper"
                }`}
              >
                <span
                  className={`relative font-mono text-xs tabular-nums leading-none ${
                    isSelected ? "" : todayCell ? "font-medium text-stamp" : hasActivity ? "text-ink" : "text-ink-faint"
                  }`}
                >
                  {day}
                  {todayCell && !isSelected && (
                    <span className="absolute -inset-x-2 -inset-y-1.5 -rotate-6 rounded-[50%] border-[1.5px] border-stamp" />
                  )}
                </span>

                {hasActivity && (
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex flex-wrap gap-0.5">
                      {daySubs.slice(0, 3).map((sub, idx) => (
                        <span
                          key={`s${idx}`}
                          className="h-2 w-2 flex-shrink-0 rounded-full border border-ink/40"
                          style={{ background: CATEGORY_META[sub.category].color }}
                        />
                      ))}
                      {dayExps.slice(0, 3).map((exp, idx) => (
                        <span
                          key={`e${idx}`}
                          className="h-2 w-2 flex-shrink-0 border border-ink/40"
                          style={{ background: EXPENSE_CATEGORY_META[exp.category].color }}
                        />
                      ))}
                    </div>
                    <span
                      className={`hidden font-mono text-[10px] font-medium leading-none tabular-nums sm:block ${
                        isSelected ? "text-paper-2" : "text-ink-soft"
                      }`}
                    >
                      {formatCurrency(dayTotal)}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 pb-4 pt-2 text-ink-soft">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink/40 bg-carbon" />
          <span className="label-mono">Suscripción</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 border border-ink/40 bg-carbon" />
          <span className="label-mono">Gasto</span>
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDay && (selectedSubs.length > 0 || selectedExps.length > 0) && (
        <div className="animate-fade-in border-t-[1.5px] border-ink bg-paper px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-lg font-bold tracking-tight">
              {selectedDay} de {MONTH_NAMES[month]}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-medium tabular-nums">
                {formatCurrency(selectedSubsTotal + selectedExpsTotal)}
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                aria-label="Cerrar"
                className="flex h-7 w-7 cursor-pointer items-center justify-center border-[1.5px] border-ink transition-colors hover:bg-marker"
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <ul className="font-mono text-sm">
            {selectedSubs.map(sub => (
              <li key={sub.id} className="leader py-1.5">
                <span className="truncate">
                  {CATEGORY_META[sub.category].icon} {sub.name}
                  <span className="ml-2 text-xs text-ink-faint">suscripción</span>
                </span>
                <span className="leader-fill" />
                <span className="tabular-nums">{formatCurrency(toMonthlyPrice(sub))}</span>
              </li>
            ))}
            {selectedExps.map(exp => (
              <li key={exp.id} className="leader py-1.5 text-carbon">
                <span className="truncate">
                  {EXPENSE_CATEGORY_META[exp.category].icon} {exp.name}
                  <span className="ml-2 text-xs opacity-60">gasto</span>
                </span>
                <span className="leader-fill" />
                <span className="tabular-nums">{formatCurrency(exp.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
