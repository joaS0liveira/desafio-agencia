"use client";

import { useId } from "react";
import { ClientGrid } from "@/components/clients/ClientGrid";
import { EmptyState, PageSkeleton } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { PageHeader } from "@/components/ui/Panel";
import {
  type ClientSort,
  type ClientView,
  useClients,
} from "@/hooks/useClients";

const sortOptions: { value: ClientSort; label: string }[] = [
  { value: "billed", label: "Mais faturado" },
  { value: "open", label: "Mais em aberto" },
  { value: "inactive", label: "Parados há mais tempo" },
  { value: "name", label: "Nome (A-Z)" },
];

const views: { value: ClientView; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Com valores em aberto" },
  { value: "inactive", label: "Parados" },
];

export default function ClientsPage() {
  const c = useClients();
  const id = useId();

  if (c.loading) return <PageSkeleton />;

  const label = "text-xs font-medium text-muted";

  return (
    <>
      <PageHeader
        title="Clientes"
        description={`${c.list.length} de ${c.total} clientes`}
      />

      <section
        aria-label="Filtros"
        className="card mb-4 grid grid-cols-2 items-end gap-3 p-4 lg:grid-cols-[minmax(200px,2fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(190px,1.2fr)_auto]"
      >
        <div className="col-span-2 flex flex-col gap-1.5 lg:col-span-1">
          <label htmlFor={`${id}-pesquisa`} className={label}>
            Pesquisar
          </label>
          <input
            id={`${id}-pesquisa`}
            type="search"
            className="field"
            placeholder="Nome da empresa"
            value={c.filters.search}
            onChange={(e) => c.setFilter("search", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-setor`} className={label}>
            Setor
          </label>
          <select
            id={`${id}-setor`}
            className="field"
            value={c.filters.sector ?? ""}
            onChange={(e) => c.setFilter("sector", e.target.value || null)}
          >
            <option value="">Todos</option>
            {c.sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-cidade`} className={label}>
            Cidade
          </label>
          <select
            id={`${id}-cidade`}
            className="field"
            value={c.filters.city ?? ""}
            onChange={(e) => c.setFilter("city", e.target.value || null)}
          >
            <option value="">Todas</option>
            {c.cities.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-ordem`} className={label}>
            Ordenar por
          </label>
          <select
            id={`${id}-ordem`}
            className="field"
            value={c.sort}
            onChange={(e) => c.setSort(e.target.value as ClientSort)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn-secondary disabled:pointer-events-none disabled:opacity-50"
          onClick={c.resetFilters}
          disabled={!c.hasFilters}
        >
          Limpar filtros
        </button>
      </section>

      {/* Vistas rápidas: respondem a "quem devo contactar?" sem ler todos os cartões */}
      <fieldset className="mb-4 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-border bg-surface-soft p-1">
        <legend className="sr-only">Mostrar</legend>
        {views.map((v) => {
          const active = c.view === v.value;
          return (
            <button
              key={v.value}
              type="button"
              aria-pressed={active}
              onClick={() => c.setView(v.value)}
              className={`flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-surface text-text shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              {v.label}
              <span
                className={`min-w-5 rounded-full px-1.5 text-center text-xs font-semibold tabular-nums ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-border/70 text-muted"
                }`}
              >
                {c.viewCounts[v.value]}
              </span>
            </button>
          );
        })}
      </fieldset>

      {c.list.length === 0 ? (
        <div className="card">
          <EmptyState
            title="Nenhum cliente encontrado"
            text={
              c.view === "inactive"
                ? "Nenhum cliente está parado há mais de 90 dias com estes filtros."
                : c.view === "open"
                  ? "Nenhum cliente com estes filtros tem valores por receber."
                  : "Experimenta outro nome, setor ou cidade."
            }
            action={
              <button
                type="button"
                className="btn btn-secondary"
                onClick={c.resetFilters}
              >
                Limpar filtros
              </button>
            }
          />
        </div>
      ) : (
        <>
          <ClientGrid clientList={c.pageItems} />
          <Pagination
            page={c.page}
            totalPages={c.totalPages}
            onChange={(page) => {
              c.setPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            summary={`A mostrar ${c.range.from}–${c.range.to} de ${c.list.length} clientes`}
          />
        </>
      )}
    </>
  );
}
