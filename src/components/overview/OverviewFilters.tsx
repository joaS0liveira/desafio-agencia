"use client";

import { useId } from "react";
import { useFilters } from "@/hooks/useFilters";
import type { PeriodGroup } from "@/lib/periods";
import type { OrderStatus } from "@/types";

function Field({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Barra de filtros da Visão geral. Os filtros ficam na store (Zustand). */
export function OverviewFilters({
  periodOptions,
  currentPeriodKey,
}: {
  /** Atalhos, trimestres e meses (lib/periods.ts) */
  periodOptions: PeriodGroup[];
  /** key da opção escolhida ("all" = todo o período) */
  currentPeriodKey: string;
}) {
  const { filters, setFilter, resetFilters, hasActiveFilters, options } =
    useFilters();
  const id = useId();
  const allOptions = periodOptions.flatMap((g) => g.options);

  return (
    <section
      aria-label="Filtros"
      className="card mb-6 grid grid-cols-2 items-end gap-3 p-4 md:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
    >
      <Field id={`${id}-periodo`} label="Período">
        <select
          id={`${id}-periodo`}
          className="field"
          value={currentPeriodKey}
          onChange={(e) =>
            setFilter(
              "period",
              allOptions.find((p) => p.key === e.target.value)?.value ?? null,
            )
          }
        >
          {currentPeriodKey === "custom" && (
            <option value="custom">Período escolhido</option>
          )}
          {periodOptions.map((group) =>
            group.label ? (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              group.options.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))
            ),
          )}
        </select>
      </Field>
      <Field id={`${id}-servico`} label="Serviço">
        <select
          id={`${id}-servico`}
          className="field"
          value={filters.service ?? ""}
          onChange={(e) => setFilter("service", e.target.value || null)}
        >
          <option value="">Todos</option>
          {options.services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-estado`} label="Estado">
        <select
          id={`${id}-estado`}
          className="field"
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilter("status", (e.target.value || null) as OrderStatus | null)
          }
        >
          <option value="">Todos</option>
          {options.statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-setor`} label="Setor">
        <select
          id={`${id}-setor`}
          className="field"
          value={filters.sector ?? ""}
          onChange={(e) => setFilter("sector", e.target.value || null)}
        >
          <option value="">Todos</option>
          {options.sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <button
        type="button"
        className="btn btn-secondary disabled:pointer-events-none disabled:opacity-50"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Limpar filtros
      </button>
    </section>
  );
}
