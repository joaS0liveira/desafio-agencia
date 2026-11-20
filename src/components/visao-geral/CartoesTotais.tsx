import { Cartao, GrelhaCartoes } from "@/components/ui/Cartao";
import { monthLabel } from "@/lib/dates";
import { openDetail, openTone } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";
import type { OrderTotals } from "@/types/reports";

/** "2026-10" -> "set" (o mês antes, abreviado) */
function mesAnterior(mes: string): string {
  const data = new Date(`${mes}-01T00:00:00Z`);
  data.setUTCMonth(data.getUTCMonth() - 1);
  return monthLabel(data.toISOString().slice(0, 7)).slice(0, 3);
}

export function CartoesTotais({
  totais,
  variacao,
  series,
}: {
  totais: OrderTotals;
  variacao: { month: string; change: number } | null;
  series: { billed: number[]; received: number[]; open: number[] };
}) {
  return (
    <GrelhaCartoes>
      <Cartao
        icone="faturado"
        rotulo="Faturado"
        valor={formatEuro(totais.billed)}
        detalhe={`${totais.orderCount} encomendas`}
        serie={series.billed}
        variacao={
          variacao && {
            valor: variacao.change,
            texto: `${monthLabel(variacao.month)} face ao mês anterior`,
            curto: `vs ${mesAnterior(variacao.month)}`,
          }
        }
      />
      <Cartao
        icone="recebido"
        rotulo="Recebido"
        valor={formatEuro(totais.received)}
        detalhe={`${formatPercent(totais.collectionRate)} do faturado`}
        serie={series.received}
      />
      <Cartao
        icone="aberto"
        rotulo="Em aberto"
        valor={formatEuro(totais.open)}
        detalhe={openDetail(totais.overdue, totais.pending)}
        // Regra única: vermelho se há atraso, âmbar se só pendente, normal se nada
        tom={openTone(totais.overdue, totais.pending)}
        serie={series.open}
      />
      <Cartao
        icone="ticket"
        rotulo="Ticket médio"
        valor={formatEuro(totais.averageTicket)}
        detalhe="por encomenda"
      />
    </GrelhaCartoes>
  );
}
