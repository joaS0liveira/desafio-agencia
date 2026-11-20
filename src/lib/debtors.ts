import type { CollectionRow } from "@/types/reports";
import { type Client, ORDER_STATUS } from "../types/index.ts";
import { emailLink } from "./actions.ts";
import { formatDate, formatEuro } from "./format.ts";

// Funções puras para o ecrã de Cobranças: entram linhas de cobrança, sai informação.

/**
 * Regra única para a cor de "Em aberto" em todo o site: a cor do pior estado lá dentro.
 * Há atraso → "perigo" (vermelho); só pendente → "aviso" (âmbar); nada por receber → "normal".
 */
export function openTone(
  overdue: number,
  pending: number,
): "perigo" | "aviso" | "normal" {
  if (overdue > 0) return "perigo";
  if (pending > 0) return "aviso";
  return "normal";
}

/** Texto de apoio para "Em aberto": quanto está em atraso, ou que é tudo pendente. */
export function openDetail(overdue: number, pending: number): string {
  if (overdue > 0) return `${formatEuro(overdue)} em atraso`;
  if (pending > 0) return "tudo pendente, nada em atraso";
  return "nada por receber";
}

export interface AgeBucket {
  key: string;
  label: string;
  amount: number;
  count: number;
  /** 0 a 1, parte do total em aberto */
  share: number;
}

const BUCKETS = [
  { key: "0-30", label: "Até 30 dias", max: 30 },
  { key: "31-60", label: "31 a 60 dias", max: 60 },
  { key: "61-90", label: "61 a 90 dias", max: 90 },
  { key: "90+", label: "Mais de 90 dias", max: Number.POSITIVE_INFINITY },
] as const;

/** Dívida em faixas de antiguidade (dias desde a emissão da fatura). */
export function ageBuckets(rows: CollectionRow[]): AgeBucket[] {
  const total = rows.reduce((sum, row) => sum + row.order.amount, 0);
  return BUCKETS.map((bucket, index) => {
    const min = index === 0 ? 0 : BUCKETS[index - 1].max + 1;
    const inBucket = rows.filter(
      (row) => row.daysOutstanding >= min && row.daysOutstanding <= bucket.max,
    );
    const amount = inBucket.reduce((sum, row) => sum + row.order.amount, 0);
    return {
      key: bucket.key,
      label: bucket.label,
      amount,
      count: inBucket.length,
      share: total ? amount / total : 0,
    };
  });
}

const isOverdue = (row: CollectionRow) =>
  row.order.status === ORDER_STATUS.overdue;

/** Atrasos primeiro; dentro de cada grupo, do maior valor para o menor. */
export function sortByPriority(rows: CollectionRow[]): CollectionRow[] {
  return [...rows].sort(
    (a, b) =>
      Number(isOverdue(b)) - Number(isOverdue(a)) ||
      b.order.amount - a.order.amount,
  );
}

export interface Debtor {
  client: Client;
  rows: CollectionRow[];
  total: number;
  overdue: number;
  oldestDays: number;
}

/** A dívida agrupada por cliente: quem tem mais em atraso aparece primeiro. */
export function debtorsByClient(rows: CollectionRow[]): Debtor[] {
  const byClient = new Map<number, Debtor>();
  for (const row of rows) {
    if (!row.client) continue;
    const debtor = byClient.get(row.client.id) ?? {
      client: row.client,
      rows: [],
      total: 0,
      overdue: 0,
      oldestDays: 0,
    };
    debtor.rows.push(row);
    debtor.total += row.order.amount;
    if (isOverdue(row)) debtor.overdue += row.order.amount;
    debtor.oldestDays = Math.max(debtor.oldestDays, row.daysOutstanding);
    byClient.set(row.client.id, debtor);
  }
  return [...byClient.values()].sort(
    (a, b) => b.overdue - a.overdue || b.total - a.total,
  );
}

/** Um só email por cliente, com todas as faturas por pagar listadas. */
export function debtorEmailLink(debtor: Debtor): string {
  const { client, rows, total } = debtor;
  const lines = sortByPriority(rows).map(
    ({ order }) =>
      `- ${order.service}, emitida a ${formatDate(order.date)}: ${formatEuro(order.amount)} (${order.status.toLowerCase()})`,
  );
  const subject = `Faturas por pagar: ${formatEuro(total)}`;
  const body = [
    `Olá ${client.contact_name},`,
    "",
    `Segue o resumo das faturas que ainda não foram pagas, num total de ${formatEuro(total)}:`,
    "",
    ...lines,
    "",
    "Obrigado,",
    "Equipa jrl.labs",
  ].join("\n");
  return emailLink(client.email, subject, body);
}
