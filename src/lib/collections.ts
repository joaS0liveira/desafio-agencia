import type {
  CollectionRow,
  CollectionSort,
  CollectionSummary,
} from "@/types/reports";
import { type Client, ORDER_STATUS, type Order } from "../types/index.ts";
import { indexClients } from "./clients.ts";
import { daysBetween, latestDate } from "./dates.ts";
import { totals } from "./stats.ts";

export const openOrders = (orders: Order[]): Order[] =>
  orders.filter((order) => order.status !== ORDER_STATUS.paid);

export function collectionSummary(orders: Order[]): CollectionSummary {
  const outstanding = openOrders(orders);
  const { overdue, overdueCount, pending, pendingCount, open } =
    totals(outstanding);
  return {
    overdue: { amount: overdue, count: overdueCount },
    pending: { amount: pending, count: pendingCount },
    totalOpen: open,
    clientsWithOpenOrders: new Set(outstanding.map((order) => order.client_id))
      .size,
  };
}

export function collectionRows(
  orders: Order[],
  clients: Client[],
  referenceDate = latestDate(orders),
): CollectionRow[] {
  const clientsById = indexClients(clients);
  return openOrders(orders).map((order) => ({
    order,
    client: clientsById.get(order.client_id),
    daysOutstanding: referenceDate ? daysBetween(order.date, referenceDate) : 0,
  }));
}

export function sortCollections(
  rows: CollectionRow[],
  sort: CollectionSort = "amount",
): CollectionRow[] {
  return [...rows].sort((a, b) => {
    switch (sort) {
      case "days":
        return b.daysOutstanding - a.daysOutstanding;
      case "date":
        return b.order.date.localeCompare(a.order.date);
      case "client":
        return (a.client?.company ?? "").localeCompare(
          b.client?.company ?? "",
          "pt",
        );
      default:
        return b.order.amount - a.order.amount;
    }
  });
}

export function filterCollections(
  rows: CollectionRow[],
  status?: string | null,
  service?: string | null,
): CollectionRow[] {
  return rows.filter(
    ({ order }) =>
      (!status || status === "Todos" || order.status === status) &&
      (!service || service === "Todos" || order.service === service),
  );
}
