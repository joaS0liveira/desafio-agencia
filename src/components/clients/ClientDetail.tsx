"use client";

import Link from "next/link";
import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { ClientHeader } from "@/components/clients/ClientHeader";
import { PurchasedServices } from "@/components/clients/PurchasedServices";
import { RecentOrders } from "@/components/clients/RecentOrders";
import { EmptyState, PageSkeleton } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { PageHeader, Panel } from "@/components/ui/Panel";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { useAppData } from "@/hooks/useAppData";
import { useClient } from "@/hooks/useClient";
import { ordersForClient } from "@/lib/clients";
import { openDetail, openTone } from "@/lib/debtors";
import { formatDate, formatEuro } from "@/lib/format";
import { totals } from "@/lib/stats";

const backLink = (
  <Link href="/clientes" className="btn btn-ghost -ml-2.5 text-xs">
    <Icon name="arrowLeft" size={14} /> Todos os clientes
  </Link>
);

export function ClientDetail({ id }: { id: string }) {
  const data = useClient(id, Number.POSITIVE_INFINITY); // todas, da mais recente para a mais antiga
  const { orders } = useAppData();

  if (data.loading) return <PageSkeleton />;

  if (data.notFound || !data.client) {
    return (
      <div className="card">
        <EmptyState
          icon="users"
          title="Cliente não encontrado"
          text="Este cliente não existe ou foi removido. Volta à lista para escolher outro."
          action={backLink}
        />
      </div>
    );
  }

  const { client, summary } = data;
  const clientOrders = ordersForClient(orders, client.id);
  const { overdue, pending } = totals(clientOrders);
  const inactive = (summary.daysSinceLastOrder ?? 0) > 90;

  return (
    <>
      {backLink}
      <PageHeader title={client.company} />
      <ClientHeader
        client={client}
        emailHref={data.emailHref}
        phoneHref={data.phoneHref}
      />

      {/* Telemóvel: 2 colunas e sem o ícone, para os cartões não empurrarem o resto */}
      <StatGrid compact>
        <StatCard
          compact
          icon="trendUp"
          label="Total faturado"
          value={formatEuro(summary.billed)}
          detail={`${summary.agencySharePercent.toFixed(0)}% da agência`}
        />
        <StatCard
          compact
          icon="ticket"
          label="Encomendas"
          value={String(summary.orderCount)}
          detail={`ticket médio ${formatEuro(summary.averageTicket)}`}
        />
        <StatCard
          compact
          icon="card"
          label="Em aberto"
          value={formatEuro(summary.open)}
          // Regra única: vermelho se há atraso, âmbar se só pendente
          detail={
            summary.openOrderCount
              ? `${openDetail(overdue, pending)} · ${summary.openOrderCount} ${summary.openOrderCount === 1 ? "fatura" : "faturas"}`
              : openDetail(overdue, pending)
          }
          tone={openTone(overdue, pending)}
        />
        <StatCard
          compact
          icon="clock"
          label="Última encomenda"
          value={
            summary.lastOrderDate ? formatDate(summary.lastOrderDate) : "—"
          }
          detail={
            summary.daysSinceLastOrder != null
              ? inactive
                ? `parado há ${summary.daysSinceLastOrder} dias`
                : `há ${summary.daysSinceLastOrder} dias`
              : undefined
          }
          tone={inactive ? "warning" : "normal"}
        />
      </StatGrid>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Panel title="Faturação por mês" subtitle="Encomendas deste cliente">
          <MonthlyChart data={data.monthlyRevenue} kind="barras" />
        </Panel>
        <PurchasedServices
          services={data.services}
          missing={data.missingServices}
        />
      </div>

      <div className="mt-3">
        <RecentOrders orders={data.recentOrders} />
      </div>
    </>
  );
}
