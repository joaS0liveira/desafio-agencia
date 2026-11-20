"use client";

import { GraficoMeses } from "@/components/graficos/GraficoMeses";
import { Bloco, CabecalhoPagina } from "@/components/ui/Bloco";
import { ACarregar, EstadoVazio } from "@/components/ui/EstadoVazio";
import { CartoesTotais } from "@/components/visao-geral/CartoesTotais";
import { ClientesParados } from "@/components/visao-geral/ClientesParados";
import { Filtros } from "@/components/visao-geral/Filtros";
import { PorServico } from "@/components/visao-geral/PorServico";
import { TopClientes } from "@/components/visao-geral/TopClientes";
import { useOverview } from "@/hooks/useOverview";
import { formatDate } from "@/lib/format";
import { useStore } from "@/store/useStore";

export default function VisaoGeralPage() {
  const dados = useOverview();
  const resetFilters = useStore((s) => s.resetFilters);

  if (dados.loading) return <ACarregar />;

  // O cabeçalho diz sempre que período está a ser mostrado (limitado às datas com dados)
  const intervalo = dados.dateRange;
  const escolhido = dados.selectedPeriod?.value;
  const de =
    escolhido?.from && intervalo && escolhido.from > intervalo.from
      ? escolhido.from
      : intervalo?.from;
  const ate =
    escolhido?.to && intervalo && escolhido.to < intervalo.to
      ? escolhido.to
      : intervalo?.to;
  const periodo =
    de && ate
      ? dados.selectedPeriod
        ? `${dados.selectedPeriod.label} · ${formatDate(de)} a ${formatDate(ate)}`
        : `Dados de ${formatDate(de)} a ${formatDate(ate)}`
      : undefined;

  return (
    <>
      <CabecalhoPagina titulo="Visão geral" descricao={periodo} />
      <Filtros
        periodos={dados.periods}
        periodoAtual={dados.selectedPeriod?.key ?? "all"}
      />

      {dados.isEmpty ? (
        // "Clientes parados" não depende dos filtros, por isso continua visível
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start">
          <div className="card">
            <EstadoVazio
              titulo="Nenhuma encomenda com estes filtros"
              texto="Experimenta outro período, serviço ou estado."
              acao={
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetFilters}
                >
                  Limpar filtros
                </button>
              }
            />
          </div>
          <ClientesParados parados={dados.inactive} />
        </div>
      ) : (
        <>
          <CartoesTotais
            totais={dados.totals}
            variacao={dados.lastMonthChange}
            series={dados.sparklines}
          />

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <Bloco
              titulo="Faturação por mês"
              subtitulo={
                dados.selectedPeriod
                  ? `${dados.selectedPeriod.label} a verde; o resto do ano a cinzento, para comparar`
                  : "Valor das encomendas emitidas em cada mês"
              }
            >
              <GraficoMeses
                dados={dados.monthly}
                media={dados.monthlyAverage}
                destaque={dados.highlightedMonths}
              />
            </Bloco>
            {/* A key recomeça o card quando o filtro de serviço muda, para o destaque o seguir */}
            <PorServico
              key={dados.selectedService ?? "todos"}
              servicos={dados.services}
              filtrado={dados.selectedService}
            />
            <TopClientes
              clientes={dados.topClients}
              pesoTop3={dados.top3Share}
            />
            <ClientesParados parados={dados.inactive} />
          </div>
        </>
      )}
    </>
  );
}
