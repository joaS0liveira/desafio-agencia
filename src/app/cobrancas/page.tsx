"use client";

import { useId } from "react";
import { AntiguidadeDivida } from "@/components/cobrancas/AntiguidadeDivida";
import { CartoesCobranca } from "@/components/cobrancas/CartoesCobranca";
import { DevedoresPorCliente } from "@/components/cobrancas/DevedoresPorCliente";
import { TabelaCobrancas } from "@/components/cobrancas/TabelaCobrancas";
import { CabecalhoPagina } from "@/components/ui/Bloco";
import { ACarregar, EstadoVazio } from "@/components/ui/EstadoVazio";
import { Icone } from "@/components/ui/Icone";
import { useAppData } from "@/hooks/useAppData";
import { type CollectionsSort, useCollections } from "@/hooks/useCollections";
import { formatEuro } from "@/lib/format";
import { ORDER_STATUS, type OrderStatus } from "@/types";

const ordenacoes: { valor: CollectionsSort; rotulo: string }[] = [
  { valor: "priority", rotulo: "Prioridade (atrasos primeiro)" },
  { valor: "amount", rotulo: "Maior valor" },
  { valor: "days", rotulo: "Mais antigas" },
  { valor: "date", rotulo: "Mais recentes" },
  { valor: "client", rotulo: "Cliente (A-Z)" },
];

/** Descarrega o CSV. O "﻿" no início faz o Excel ler bem os acentos. */
function descarregarCsv(csv: string) {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cobrancas.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function CobrancasPage() {
  const { clients } = useAppData();
  const c = useCollections();
  const id = useId();

  if (c.loading) return <ACarregar />;

  const rotulo = "text-xs font-medium text-muted";

  return (
    <>
      <CabecalhoPagina
        titulo="Cobranças"
        descricao="Pendente = ainda dentro do prazo · Em atraso = prazo ultrapassado. Os dias contam desde a emissão da fatura até à última encomenda registada."
        acoes={
          <button
            type="button"
            className="btn btn-secondary disabled:opacity-50"
            onClick={() => descarregarCsv(c.csv)}
            disabled={c.rows.length === 0}
          >
            <Icone nome="descarregar" tamanho={17} />
            Exportar CSV
          </button>
        }
      />

      <CartoesCobranca
        resumo={c.summary}
        pesoNoFaturado={c.openShare}
        totalClientes={clients.length}
      />

      {/* Os filtros aplicam-se a tudo o que está por baixo */}
      <section
        aria-label="Filtros"
        className="card mt-4 mb-3 flex flex-wrap items-end gap-3 p-4 sm:mt-6"
      >
        <div className="flex min-w-0 flex-1 basis-[calc(50%-6px)] flex-col gap-1.5 sm:flex-none sm:basis-auto">
          <label htmlFor={`${id}-estado`} className={rotulo}>
            Estado
          </label>
          <select
            id={`${id}-estado`}
            className="field sm:w-48"
            value={c.status ?? ""}
            onChange={(e) =>
              c.setStatus((e.target.value || null) as OrderStatus | null)
            }
          >
            <option value="">Todos</option>
            <option>{ORDER_STATUS.overdue}</option>
            <option>{ORDER_STATUS.pending}</option>
          </select>
        </div>
        <div className="flex min-w-0 flex-1 basis-[calc(50%-6px)] flex-col gap-1.5 sm:flex-none sm:basis-auto">
          <label htmlFor={`${id}-servico`} className={rotulo}>
            Serviço
          </label>
          <select
            id={`${id}-servico`}
            className="field sm:w-56"
            value={c.service ?? ""}
            onChange={(e) => c.setService(e.target.value || null)}
          >
            <option value="">Todos</option>
            {c.services.map((s) => (
              <option key={s}>{s}</option>
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
        <p className="ml-auto text-right text-sm text-muted">
          {c.rows.length} {c.rows.length === 1 ? "fatura" : "faturas"} ·{" "}
          <strong className="font-semibold text-text tabular-nums">
            {formatEuro(c.total)}
          </strong>
          {c.hasFilters && (
            <span className="block text-xs">
              Os cartões acima mostram sempre o total por cobrar.
            </span>
          )}
        </p>
      </section>

      {c.rows.length === 0 ? (
        <div className="card">
          <EstadoVazio
            icone="recebido"
            titulo="Nada por cobrar com estes filtros"
            texto="Experimenta outro estado ou serviço."
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
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
            <DevedoresPorCliente devedores={c.debtors} />
            <AntiguidadeDivida faixas={c.buckets} />
          </div>

          {/* O detalhe fatura a fatura fica recolhido: o trabalho faz-se na lista "A contactar" */}
          <details className="card group mt-3 overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-surface-soft [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-sm font-semibold">
                  Ver todas as faturas ({c.rows.length})
                </span>
                <span className="block text-xs text-muted">
                  Fatura a fatura, com o email de cobrança de cada uma
                </span>
              </span>
              <Icone
                nome="seta"
                tamanho={18}
                className="shrink-0 rotate-90 text-muted transition-transform group-open:-rotate-90"
              />
            </summary>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
              <label
                htmlFor={`${id}-ordem`}
                className="text-xs font-medium text-muted"
              >
                Ordenar por
              </label>
              <select
                id={`${id}-ordem`}
                className="field h-9 w-auto"
                value={c.sort}
                onChange={(e) => c.setSort(e.target.value as CollectionsSort)}
              >
                {ordenacoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </div>
            <TabelaCobrancas linhas={c.rows} />
          </details>
        </>
      )}
    </>
  );
}
