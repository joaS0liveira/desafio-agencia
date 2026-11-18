import type { Client, Order } from "@/types";
import type {
  ClientRevenue,
  ClientSummary,
  InactiveClient,
} from "@/types/reports";
import { daysBetween, latestDate } from "./dates.ts";
import { revenueByKey, sumOrderAmounts, totals } from "./stats.ts";

export const indexClients = (clients: Client[]): Map<number, Client> =>
  new Map(clients.map((client) => [client.id, client]));

export const ordersForClient = (orders: Order[], clientId: number): Order[] =>
  orders.filter((order) => order.client_id === clientId);

export function clientSummary(
  clientOrders: Order[],
  allOrders: Order[],
  referenceDate = latestDate(allOrders),
): ClientSummary {
  const {
    billed,
    orderCount,
    averageTicket,
    open,
    overdueCount,
    pendingCount,
  } = totals(clientOrders);
  const agencyRevenue = sumOrderAmounts(allOrders);
  const lastOrderDate = latestDate(clientOrders);
  return {
    billed,
    orderCount,
    averageTicket,
    open,
    openOrderCount: overdueCount + pendingCount,
    agencySharePercent: agencyRevenue ? (billed / agencyRevenue) * 100 : 0,
    lastOrderDate,
    daysSinceLastOrder:
      lastOrderDate && referenceDate
        ? daysBetween(lastOrderDate, referenceDate)
        : null,
  };
}

export function missingServices(
  clientOrders: Order[],
  services: string[],
): string[] {
  const purchased = new Set(clientOrders.map((order) => order.service));
  return services.filter((service) => !purchased.has(service));
}

export function inactiveClients(
  clients: Client[],
  orders: Order[],
  thresholdDays = 90,
  referenceDate = latestDate(orders),
): InactiveClient[] {
  if (!referenceDate) return [];
  const lastDates = new Map<number, string>();
  for (const { client_id, date } of orders) {
    if (date > (lastDates.get(client_id) ?? "")) lastDates.set(client_id, date);
  }

  return clients
    .map((client) => {
      const lastOrderDate = lastDates.get(client.id) ?? null;
      const daysSinceLastOrder = daysBetween(
        lastOrderDate ?? client.customer_since,
        referenceDate,
      );
      return { client, lastOrderDate, daysSinceLastOrder };
    })
    .filter((client) => client.daysSinceLastOrder > thresholdDays)
    .sort((a, b) => b.daysSinceLastOrder - a.daysSinceLastOrder);
}

export function topClients(
  orders: Order[],
  clients: Client[],
  limit = 5,
): ClientRevenue[] {
  const byId = indexClients(clients);
  const total = sumOrderAmounts(orders);
  return [...revenueByKey(orders, (order) => order.client_id)]
    .flatMap(([id, revenue]) => {
      const client = byId.get(id);
      return client
        ? [{ client, revenue, share: total ? revenue / total : 0 }]
        : [];
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export const topShare = (
  orders: Order[],
  clients: Client[],
  limit: number,
): number =>
  topClients(orders, clients, limit).reduce(
    (sum, entry) => sum + entry.share,
    0,
  );
