import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { openTone } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";
import type { CollectionSummary } from "@/types/reports";

export function CollectionStats({
  summary,
  billedShare,
  totalClients,
}: {
  summary: CollectionSummary;
  /** Parte do faturado que está por receber (0 a 1) */
  billedShare: number;
  totalClients: number;
}) {
  return (
    <StatGrid compact>
      <StatCard
        compact
        icon="card"
        label="Por cobrar"
        value={formatEuro(summary.totalOpen)}
        detail={`${formatPercent(billedShare)} do faturado`}
        tone={openTone(summary.overdue.amount, summary.pending.amount)}
      />
      <StatCard
        compact
        icon="alert"
        tone={summary.overdue.amount > 0 ? "danger" : "normal"}
        label="Em atraso"
        value={formatEuro(summary.overdue.amount)}
        detail={`${summary.overdue.count} faturas`}
      />
      <StatCard
        compact
        icon="clock"
        label="Pendente"
        tone={summary.pending.amount > 0 ? "warning" : "normal"}
        value={formatEuro(summary.pending.amount)}
        detail={`${summary.pending.count} faturas por vencer`}
      />
      <StatCard
        compact
        icon="users"
        label="Clientes a dever"
        value={String(summary.clientsWithOpenOrders)}
        detail={`de ${totalClients} clientes`}
      />
    </StatGrid>
  );
}
