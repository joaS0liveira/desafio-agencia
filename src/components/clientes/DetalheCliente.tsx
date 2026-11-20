"use client";

import Link from "next/link";
import { GraficoMeses } from "@/components/graficos/GraficoMeses";
import { Bloco, CabecalhoPagina } from "@/components/ui/Bloco";
import { Cartao, GrelhaCartoes } from "@/components/ui/Cartao";
import { ACarregar, EstadoVazio } from "@/components/ui/EstadoVazio";
import { Icone } from "@/components/ui/Icone";
import { useAppData } from "@/hooks/useAppData";
import { useClient } from "@/hooks/useClient";
import { ordersForClient } from "@/lib/clients";
import { openDetail, openTone } from "@/lib/debtors";
import { formatDate, formatEuro } from "@/lib/format";
import { totals } from "@/lib/stats";
import { CabecalhoCliente } from "./CabecalhoCliente";
import { EncomendasRecentes } from "./EncomendasRecentes";
import { ServicosComprados } from "./ServicosComprados";

const voltar = (
  <Link href="/clientes" className="btn btn-ghost -ml-2.5 text-xs">
    <Icone nome="voltar" tamanho={14} /> Todos os clientes
  </Link>
);

export function DetalheCliente({ id }: { id: string }) {
  const dados = useClient(id, Number.POSITIVE_INFINITY); // todas, da mais recente para a mais antiga
  const { orders } = useAppData();

  if (dados.loading) return <ACarregar />;

  if (dados.notFound || !dados.client) {
    return (
      <div className="card">
        <EstadoVazio
          icone="clientes"
          titulo="Cliente não encontrado"
          texto={`Não existe nenhum cliente com o id ${id}.`}
          acao={voltar}
        />
      </div>
    );
  }

  const { client, summary } = dados;
  const encomendasCliente = ordersForClient(orders, client.id);
  const { overdue, pending } = totals(encomendasCliente);
  const parado = (summary.daysSinceLastOrder ?? 0) > 90;

  return (
    <>
      {voltar}
      <CabecalhoPagina titulo={client.company} />
      <CabecalhoCliente
        cliente={client}
        emailHref={dados.emailHref}
        phoneHref={dados.phoneHref}
      />

      <GrelhaCartoes>
        <Cartao
          icone="faturado"
          rotulo="Total faturado"
          valor={formatEuro(summary.billed)}
          detalhe={`${summary.agencySharePercent.toFixed(0)}% da agência`}
        />
        <Cartao
          icone="ticket"
          rotulo="Encomendas"
          valor={String(summary.orderCount)}
          detalhe={`ticket médio ${formatEuro(summary.averageTicket)}`}
        />
        <Cartao
          icone="aberto"
          rotulo="Em aberto"
          valor={formatEuro(summary.open)}
          // Regra única: vermelho se há atraso, âmbar se só pendente
          detalhe={
            summary.openOrderCount
              ? `${openDetail(overdue, pending)} · ${summary.openOrderCount} ${summary.openOrderCount === 1 ? "fatura" : "faturas"}`
              : openDetail(overdue, pending)
          }
          tom={openTone(overdue, pending)}
        />
        <Cartao
          icone="relogio"
          rotulo="Última encomenda"
          valor={
            summary.lastOrderDate ? formatDate(summary.lastOrderDate) : "—"
          }
          detalhe={
            summary.daysSinceLastOrder != null
              ? parado
                ? `parado há ${summary.daysSinceLastOrder} dias`
                : `há ${summary.daysSinceLastOrder} dias`
              : undefined
          }
          tom={parado ? "aviso" : "normal"}
        />
      </GrelhaCartoes>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Bloco titulo="Faturação por mês" subtitulo="Encomendas deste cliente">
          <GraficoMeses dados={dados.monthlyRevenue} tipo="barras" />
        </Bloco>
        <ServicosComprados
          servicos={dados.services}
          emFalta={dados.missingServices}
        />
      </div>

      <div className="mt-3">
        <EncomendasRecentes encomendas={dados.recentOrders} />
      </div>
    </>
  );
}
