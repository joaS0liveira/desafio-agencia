import type { Client, Order } from "@/types";
import { dataMaisRecente, diasEntre } from "./datas";

export interface ResumoCliente {
  totalFaturado: number;
  numeroEncomendas: number;
  ticketMedio: number;
  emAberto: number;
  encomendasEmAberto: number;
  /** Percentagem (0–100) da faturação total da agência. */
  pesoNaAgencia: number;
  ultimaEncomenda: string | null;
  diasSemEncomendar: number | null;
}

export interface ServicoComprado {
  servico: string;
  valor: number;
}

export interface ClienteParado {
  cliente: Client;
  ultimaEncomenda: string | null;
  diasSemEncomendar: number;
}

/** Map id -> cliente, para juntar encomendas e clientes sem percorrer o array. */
export function mapaClientes(clientes: Client[]): Map<number, Client> {
  return new Map(clientes.map((cliente) => [cliente.id, cliente]));
}

export function encomendasDoCliente(
  encomendas: Order[],
  clienteId: number,
): Order[] {
  return encomendas.filter((encomenda) => encomenda.client_id === clienteId);
}

/** Serviços diferentes que existem nas encomendas, por ordem alfabética. */
export function listaServicos(encomendas: Order[]): string[] {
  return [...new Set(encomendas.map((encomenda) => encomenda.service))].sort(
    (a, b) => a.localeCompare(b, "pt"),
  );
}

/**
 * Números do cabeçalho do detalhe do cliente.
 * `todas` = todas as encomendas da agência (para o peso na agência e a data de referência).
 */
export function resumoCliente(
  clienteId: number,
  todas: Order[],
  referencia: string | null = dataMaisRecente(todas),
): ResumoCliente {
  const doCliente = encomendasDoCliente(todas, clienteId);
  const totalAgencia = todas.reduce((soma, e) => soma + e.amount, 0);
  const totalFaturado = doCliente.reduce((soma, e) => soma + e.amount, 0);
  const abertas = doCliente.filter((e) => e.status !== "Paga");
  const ultimaEncomenda = dataMaisRecente(doCliente);

  return {
    totalFaturado,
    numeroEncomendas: doCliente.length,
    ticketMedio: doCliente.length ? totalFaturado / doCliente.length : 0,
    emAberto: abertas.reduce((soma, e) => soma + e.amount, 0),
    encomendasEmAberto: abertas.length,
    pesoNaAgencia: totalAgencia ? (totalFaturado / totalAgencia) * 100 : 0,
    ultimaEncomenda,
    diasSemEncomendar:
      ultimaEncomenda && referencia
        ? diasEntre(ultimaEncomenda, referencia)
        : null,
  };
}

/** Quanto o cliente gastou em cada serviço, do maior para o menor. */
export function servicosComprados(
  encomendasCliente: Order[],
): ServicoComprado[] {
  const porServico = new Map<string, number>();
  for (const encomenda of encomendasCliente) {
    porServico.set(
      encomenda.service,
      (porServico.get(encomenda.service) ?? 0) + encomenda.amount,
    );
  }
  return [...porServico]
    .map(([servico, valor]) => ({ servico, valor }))
    .sort((a, b) => b.valor - a.valor);
}

/** Serviços que a agência vende e o cliente ainda não comprou (venda cruzada). */
export function servicosEmFalta(
  encomendasCliente: Order[],
  todosServicos: string[],
): string[] {
  const comprados = new Set(encomendasCliente.map((e) => e.service));
  return todosServicos.filter((servico) => !comprados.has(servico));
}

/** Clientes sem encomendas há mais de `dias` dias, do mais parado para o menos. */
export function clientesParados(
  clientes: Client[],
  encomendas: Order[],
  dias = 90,
  referencia: string | null = dataMaisRecente(encomendas),
): ClienteParado[] {
  if (!referencia) return [];

  return clientes
    .map((cliente) => {
      const ultimaEncomenda = dataMaisRecente(
        encomendasDoCliente(encomendas, cliente.id),
      );
      const diasSemEncomendar = diasEntre(
        ultimaEncomenda ?? cliente.customer_since,
        referencia,
      );
      return { cliente, ultimaEncomenda, diasSemEncomendar };
    })
    .filter((parado) => parado.diasSemEncomendar > dias)
    .sort((a, b) => b.diasSemEncomendar - a.diasSemEncomendar);
}
