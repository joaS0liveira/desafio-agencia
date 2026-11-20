import { Cartao, GrelhaCartoes } from "@/components/ui/Cartao";
import { openTone } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";
import type { CollectionSummary } from "@/types/reports";

export function CartoesCobranca({
  resumo,
  pesoNoFaturado,
  totalClientes,
}: {
  resumo: CollectionSummary;
  /** Parte do faturado que está por receber (0 a 1) */
  pesoNoFaturado: number;
  totalClientes: number;
}) {
  return (
    <GrelhaCartoes compacta>
      <Cartao
        compacto
        icone="aberto"
        rotulo="Por cobrar"
        valor={formatEuro(resumo.totalOpen)}
        detalhe={`${formatPercent(pesoNoFaturado)} do faturado`}
        tom={openTone(resumo.overdue.amount, resumo.pending.amount)}
      />
      <Cartao
        compacto
        icone="alerta"
        tom={resumo.overdue.amount > 0 ? "perigo" : "normal"}
        rotulo="Em atraso"
        valor={formatEuro(resumo.overdue.amount)}
        detalhe={`${resumo.overdue.count} faturas`}
      />
      <Cartao
        compacto
        icone="relogio"
        rotulo="Pendente"
        tom={resumo.pending.amount > 0 ? "aviso" : "normal"}
        valor={formatEuro(resumo.pending.amount)}
        detalhe={`${resumo.pending.count} faturas por vencer`}
      />
      <Cartao
        compacto
        icone="clientes"
        rotulo="Clientes a dever"
        valor={String(resumo.clientsWithOpenOrders)}
        detalhe={`de ${totalClientes} clientes`}
      />
    </GrelhaCartoes>
  );
}
