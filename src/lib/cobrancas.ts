import type { Client, Order } from "@/types";
import { mapaClientes } from "./clientes";
import { dataMaisRecente, diasEntre } from "./datas";

/** Valores de `status` em encomendas.json. */
export type EstadoEncomenda = "Paga" | "Pendente" | "Em atraso";

/** Uma linha da tabela de cobranças: a encomenda, o cliente e há quantos dias foi emitida. */
export interface LinhaCobranca {
  encomenda: Order;
  cliente: Client | undefined;
  dias: number;
}

export type OrdenacaoCobranca = "valor" | "dias" | "data" | "cliente";

export interface ResumoCobrancas {
  emAtraso: { valor: number; quantidade: number };
  pendente: { valor: number; quantidade: number };
  totalEmAberto: number;
  clientesComValoresEmAberto: number;
}

/** Encomendas ainda por receber (Pendente ou Em atraso). */
export function encomendasEmAberto(encomendas: Order[]): Order[] {
  return encomendas.filter((encomenda) => encomenda.status !== "Paga");
}

function somaPorEstado(encomendas: Order[], estado: EstadoEncomenda) {
  const doEstado = encomendas.filter((e) => e.status === estado);
  return {
    valor: doEstado.reduce((soma, e) => soma + e.amount, 0),
    quantidade: doEstado.length,
  };
}

/** Os três cartões do ecrã de Cobranças. */
export function resumoCobrancas(encomendas: Order[]): ResumoCobrancas {
  const abertas = encomendasEmAberto(encomendas);
  return {
    emAtraso: somaPorEstado(abertas, "Em atraso"),
    pendente: somaPorEstado(abertas, "Pendente"),
    totalEmAberto: abertas.reduce((soma, e) => soma + e.amount, 0),
    clientesComValoresEmAberto: new Set(abertas.map((e) => e.client_id)).size,
  };
}

/**
 * Linhas da tabela de cobranças, já com o cliente de cada encomenda.
 * `referencia` = data a partir da qual se contam os dias (por defeito, a encomenda mais recente).
 */
export function linhasCobranca(
  encomendas: Order[],
  clientes: Client[],
  referencia: string | null = dataMaisRecente(encomendas),
): LinhaCobranca[] {
  const clientesPorId = mapaClientes(clientes);
  return encomendasEmAberto(encomendas).map((encomenda) => ({
    encomenda,
    cliente: clientesPorId.get(encomenda.client_id),
    dias: referencia ? diasEntre(encomenda.date, referencia) : 0,
  }));
}

/** Devolve uma cópia ordenada (não altera o array original). */
export function ordenarCobrancas(
  linhas: LinhaCobranca[],
  ordem: OrdenacaoCobranca = "valor",
): LinhaCobranca[] {
  const copia = [...linhas];
  switch (ordem) {
    case "valor":
      return copia.sort((a, b) => b.encomenda.amount - a.encomenda.amount);
    case "dias":
      return copia.sort((a, b) => b.dias - a.dias);
    case "data":
      return copia.sort((a, b) =>
        b.encomenda.date.localeCompare(a.encomenda.date),
      );
    case "cliente":
      return copia.sort((a, b) =>
        (a.cliente?.company ?? "").localeCompare(
          b.cliente?.company ?? "",
          "pt",
        ),
      );
  }
}

/** Filtra as linhas por estado e por serviço ("Todos" ou vazio = sem filtro). */
export function filtrarCobrancas(
  linhas: LinhaCobranca[],
  estado = "Todos",
  servico = "Todos",
): LinhaCobranca[] {
  return linhas.filter(
    ({ encomenda }) =>
      (!estado || estado === "Todos" || encomenda.status === estado) &&
      (!servico || servico === "Todos" || encomenda.service === servico),
  );
}
