import type { Client, Order } from "@/types";
import { formatPercent, monthKey } from "./formatar";

// types

export interface Totals {
  billed: number;
  received: number;
  open: number;      // pendente + em atraso
  overdue: number;
  pending: number;
  overdueCount: number;
  orderCount: number;
  averageTicket: number;
  collectionRate: number; // 0..1
}

export interface MonthRevenue {
    month: string;
    revenue: number
}

export interface ServiceRevenue { 
    service: string;
    revenue: number;
    count: number;
}

export interface ClientRevenue {
    client: Client;
    revenue: number;
    share: number
}

// soma o total faturado (pagos + pendente + em atraso)
const sum = (orders: Order[]) => orders.reduce((acc, o) => acc + o.amount, 0);

function groupSum<K>(orders: Order[], key: (o: Order) => K): Map<K, number> {
  const map = new Map<K, number>();
  for (const o of orders) map.set(key(o), (map.get(key(o)) ?? 0) + o.amount);
  return map;
}

// ---- Totais ----

export function totals(orders: Order[]): Totals {
  const paid = orders.filter((o) => o.status === "Paga");
  const overdue = orders.filter((o) => o.status === "Em atraso");
  const pending = orders.filter((o) => o.status === "Pendente");
  const billed = sum(orders);

  return {
    billed,
    received: sum(paid),
    open: sum(overdue) + sum(pending),
    overdue: sum(overdue),
    pending: sum(pending),
    overdueCount: overdue.length,
    orderCount: orders.length,
    averageTicket: orders.length ? billed / orders.length : 0,
    collectionRate: billed ? sum(paid) / billed : 0,
  };
}

// ---- Agrupamentos ----

// devolve array com par mes/receita
export function revenueByMonth(orders: Order[]): MonthRevenue[] {
  return [...groupSum(orders, (o) => monthKey(o.date))]
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// devolve array de receita por serviço e nº de serviços do mesmo tipo
export function revenueByService(orders: Order[]): ServiceRevenue[] {
  const counts = new Map<string, number>();
  for (const o of orders) counts.set(o.service, (counts.get(o.service) ?? 0) + 1);

  return [...groupSum(orders, (o) => o.service)]
    .map(([service, revenue]) => ({ service, revenue, count: counts.get(service) ?? 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ticket médio por serviço
export const averageTicketByService = (orders: Order[]) =>
  revenueByService(orders).map((s) => ({
    service: s.service,
    average: s.count ? s.revenue / s.count : 0,
  }));

// ---- Rankings ----

export function topClients(orders: Order[], clients: Client[], n = 5): ClientRevenue[] {
  const byId = new Map(clients.map((c) => [c.id, c]));
  const total = sum(orders);

  return [...groupSum(orders, (o) => o.client_id)]
    .flatMap(([id, revenue]) => {
      const client = byId.get(id);
      return client ? [{ client, revenue, share: total ? revenue / total : 0 }] : [];
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

// "Os 3 maiores pesam 63% da faturação" → topShare(orders, clients, 3) = 0.63
export const topShare = (orders: Order[], clients: Client[], n: number): number =>
  topClients(orders, clients, n).reduce((acc, c) => acc + c.share, 0);

// ---- Variação mensal ----

export interface MonthChange extends MonthRevenue { change: number | null } // ratio

export function monthOverMonth(series: MonthRevenue[]): MonthChange[] {
  return series.map((m, i) => {
    const prev = series[i - 1];
    return { ...m, change: prev && prev.revenue ? (m.revenue - prev.revenue) / prev.revenue : null };
  });
}