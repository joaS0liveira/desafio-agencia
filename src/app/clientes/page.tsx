"use client";

import { useId } from "react";
import { TabelaClientes } from "@/components/clientes/TabelaClientes";
import { CabecalhoPagina } from "@/components/ui/Bloco";
import { ACarregar, EstadoVazio } from "@/components/ui/EstadoVazio";
import { Paginacao } from "@/components/ui/Paginacao";
import {
  type ClientSort,
  type ClientView,
  useClients,
} from "@/hooks/useClients";

const ordenacoes: { valor: ClientSort; rotulo: string }[] = [
  { valor: "billed", rotulo: "Mais faturado" },
  { valor: "open", rotulo: "Mais em aberto" },
  { valor: "inactive", rotulo: "Parados há mais tempo" },
  { valor: "name", rotulo: "Nome (A-Z)" },
];

const vistas: { valor: ClientView; rotulo: string }[] = [
  { valor: "all", rotulo: "Todos" },
  { valor: "open", rotulo: "Com valores em aberto" },
  { valor: "inactive", rotulo: "Parados" },
];

export default function ClientesPage() {
  const c = useClients();
  const id = useId();

  if (c.loading) return <ACarregar />;

  const rotulo = "text-xs font-medium text-muted";

  return (
    <>
      <CabecalhoPagina
        titulo="Clientes"
        descricao={`${c.list.length} de ${c.total} clientes`}
      />

      <section
        aria-label="Filtros"
        className="card mb-4 grid grid-cols-2 items-end gap-3 p-4 lg:grid-cols-[minmax(200px,2fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(190px,1.2fr)_auto]"
      >
        <div className="col-span-2 flex flex-col gap-1.5 lg:col-span-1">
          <label htmlFor={`${id}-pesquisa`} className={rotulo}>
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
          <label htmlFor={`${id}-setor`} className={rotulo}>
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
          <label htmlFor={`${id}-cidade`} className={rotulo}>
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
          <label htmlFor={`${id}-ordem`} className={rotulo}>
            Ordenar por
          </label>
          <select
            id={`${id}-ordem`}
            className="field"
            value={c.sort}
            onChange={(e) => c.setSort(e.target.value as ClientSort)}
          >
            {ordenacoes.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
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
        {vistas.map((v) => {
          const ativo = c.view === v.valor;
          return (
            <button
              key={v.valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => c.setView(v.valor)}
              className={`flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-surface text-text shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              {v.rotulo}
              <span
                className={`min-w-5 rounded-full px-1.5 text-center text-xs font-semibold tabular-nums ${
                  ativo
                    ? "bg-primary text-on-primary"
                    : "bg-border/70 text-muted"
                }`}
              >
                {c.viewCounts[v.valor]}
              </span>
            </button>
          );
        })}
      </fieldset>

      {c.list.length === 0 ? (
        <div className="card">
          <EstadoVazio
            titulo="Nenhum cliente encontrado"
            texto={
              c.view === "inactive"
                ? "Nenhum cliente está parado há mais de 90 dias com estes filtros."
                : c.view === "open"
                  ? "Nenhum cliente com estes filtros tem valores por receber."
                  : "Experimenta outro nome, setor ou cidade."
            }
            acao={
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
          <TabelaClientes clientes={c.pageItems} />
          <Paginacao
            pagina={c.page}
            totalPaginas={c.totalPages}
            aoMudar={(pagina) => {
              c.setPage(pagina);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            resumo={`A mostrar ${c.range.from}–${c.range.to} de ${c.list.length} clientes`}
          />
        </>
      )}
    </>
  );
}
