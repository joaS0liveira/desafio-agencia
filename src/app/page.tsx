"use client";

import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { InactiveClientsCard } from "@/components/overview/InactiveClientsCard";
import { OverviewFilters } from "@/components/overview/OverviewFilters";
import { OverviewStats } from "@/components/overview/OverviewStats";
import { ServiceBreakdown } from "@/components/overview/ServiceBreakdown";
import { TopClients } from "@/components/overview/TopClients";
import { EmptyState, PageSkeleton } from "@/components/ui/EmptyState";
import { PageHeader, Panel } from "@/components/ui/Panel";
import { useOverview } from "@/hooks/useOverview";
import { formatDate } from "@/lib/format";
import { useStore } from "@/store/useStore";

export default function OverviewPage() {
  const data = useOverview();
  const resetFilters = useStore((s) => s.resetFilters);

  if (data.loading) return <PageSkeleton />;

  // O cabeçalho diz sempre que período está a ser mostrado (limitado às datas com dados)
  const interval = data.dateRange;
  const selected = data.selectedPeriod?.value;
  const start =
    selected?.from && interval && selected.from > interval.from
      ? selected.from
      : interval?.from;
  const end =
    selected?.to && interval && selected.to < interval.to
      ? selected.to
      : interval?.to;
  const periodText =
    start && end
      ? data.selectedPeriod
        ? `${data.selectedPeriod.label} · ${formatDate(start)} a ${formatDate(end)}`
        : `Dados de ${formatDate(start)} a ${formatDate(end)}`
      : undefined;

  return (
    <>
      <PageHeader title="Visão geral" description={periodText} />
      <OverviewFilters
        periodOptions={data.periods}
        currentPeriodKey={data.selectedPeriod?.key ?? "all"}
      />

      {data.isEmpty ? (
        // "Clientes parados" não depende dos filtros, por isso continua visível
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start">
          <div className="card">
            <EmptyState
              title="Nenhuma encomenda com estes filtros"
              text="Experimenta outro período, serviço ou estado."
              action={
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
          <InactiveClientsCard inactiveClients={data.inactive} />
        </div>
      ) : (
        <>
          <OverviewStats
            totals={data.totals}
            trend={data.lastMonthChange}
            series={data.sparklines}
          />

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <Panel
              title="Faturação por mês"
              subtitle={
                data.selectedPeriod
                  ? `${data.selectedPeriod.label} a laranja; o resto do ano a cinzento, para comparar`
                  : "Valor das encomendas emitidas em cada mês"
              }
            >
              <MonthlyChart
                data={data.monthly}
                average={data.monthlyAverage}
                highlight={data.highlightedMonths}
              />
            </Panel>
            {/* A key recomeça o card quando o filtro de serviço muda, para o destaque o seguir */}
            <ServiceBreakdown
              key={data.selectedService ?? "todos"}
              services={data.services}
              filtered={data.selectedService}
            />
            <TopClients
              clientList={data.topClients}
              top3Weight={data.top3Share}
            />
            <InactiveClientsCard inactiveClients={data.inactive} />
          </div>
        </>
      )}
    </>
  );
}
