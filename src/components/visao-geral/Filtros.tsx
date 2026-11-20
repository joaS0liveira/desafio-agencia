"use client";

import { useId } from "react";
import { useFilters } from "@/hooks/useFilters";
import type { PeriodGroup } from "@/lib/periods";
import type { OrderStatus } from "@/types";

function Campo({
  id,
  rotulo,
  children,
  className = "",
}: {
  id: string;
  rotulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {rotulo}
      </label>
      {children}
    </div>
  );
}

/** Barra de filtros da Visão geral. Os filtros ficam na store (Zustand). */
export function Filtros({
  periodos,
  periodoAtual,
}: {
  /** Atalhos, trimestres e meses (lib/periods.ts) */
  periodos: PeriodGroup[];
  /** key da opção escolhida ("all" = todo o período) */
  periodoAtual: string;
}) {
  const { filters, setFilter, resetFilters, hasActiveFilters, options } =
    useFilters();
  const id = useId();
  const todas = periodos.flatMap((g) => g.options);

  return (
    <section
      aria-label="Filtros"
      className="card mb-6 grid grid-cols-2 items-end gap-3 p-4 md:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
    >
      <Campo id={`${id}-periodo`} rotulo="Período">
        <select
          id={`${id}-periodo`}
          className="field"
          value={periodoAtual}
          onChange={(e) =>
            setFilter(
              "period",
              todas.find((p) => p.key === e.target.value)?.value ?? null,
            )
          }
        >
          {periodoAtual === "custom" && (
            <option value="custom">Período escolhido</option>
          )}
          {periodos.map((grupo) =>
            grupo.label ? (
              <optgroup key={grupo.label} label={grupo.label}>
                {grupo.options.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              grupo.options.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))
            ),
          )}
        </select>
      </Campo>
      <Campo id={`${id}-servico`} rotulo="Serviço">
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
      </Campo>
      <Campo id={`${id}-estado`} rotulo="Estado">
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
      </Campo>
      <Campo id={`${id}-setor`} rotulo="Setor">
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
      </Campo>
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
