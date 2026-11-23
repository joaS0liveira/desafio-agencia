import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { monthLabel } from "@/lib/dates";
import { openDetail, openTone } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";
import type { OrderTotals } from "@/types/reports";

/** "2026-10" -> "set" (o mês antes, abreviado) */
function previousMonth(month: string): string {
  const data = new Date(`${month}-01T00:00:00Z`);
  data.setUTCMonth(data.getUTCMonth() - 1);
  return monthLabel(data.toISOString().slice(0, 7)).slice(0, 3);
}

export function OverviewStats({
  totals,
  trend,
  series,
}: {
  totals: OrderTotals;
  trend: { month: string; change: number } | null;
  series: { billed: number[]; received: number[]; open: number[] };
}) {
  return (
    <StatGrid>
      <StatCard
        icon="trendUp"
        label="Faturado"
        value={formatEuro(totals.billed)}
        detail={`${totals.orderCount} encomendas`}
        series={series.billed}
        trend={
          trend && {
            value: trend.change,
            text: `${monthLabel(trend.month)} face ao mês anterior`,
            short: `vs ${previousMonth(trend.month)}`,
          }
        }
      />
      <StatCard
        icon="checkCircle"
        label="Recebido"
        value={formatEuro(totals.received)}
        detail={`${formatPercent(totals.collectionRate)} do faturado`}
        series={series.received}
      />
      <StatCard
        icon="card"
        label="Em aberto"
        value={formatEuro(totals.open)}
        detail={openDetail(totals.overdue, totals.pending)}
        // Regra única: vermelho se há atraso, âmbar se só pendente, normal se nada
        tone={openTone(totals.overdue, totals.pending)}
        series={series.open}
      />
      <StatCard
        icon="ticket"
        label="Ticket médio"
        value={formatEuro(totals.averageTicket)}
        detail="por encomenda"
      />
    </StatGrid>
  );
}
