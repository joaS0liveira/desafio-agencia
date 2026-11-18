import type { Client, Order } from "@/types";
import type { ClientFilters, OrderFilters } from "@/types/filters";
import { indexClients } from "./clients.ts";

export const emptyOrderFilters: OrderFilters = {
  search: "",
  period: null,
  service: null,
  status: null,
  sector: null,
};

const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function hasActiveFilters({
  search,
  period,
  service,
  status,
  sector,
}: OrderFilters): boolean {
  return Boolean(
    normalizeSearch(search) ||
      period?.from ||
      period?.to ||
      service ||
      status ||
      sector,
  );
}

export function filterOrders(
  orders: Order[],
  clients: Client[],
  filters: OrderFilters,
): Order[] {
  const clientsById = indexClients(clients);
  const query = normalizeSearch(filters.search);
  return orders.filter((order) => {
    const client = clientsById.get(order.client_id);
    if (filters.service && order.service !== filters.service) return false;
    if (filters.status && order.status !== filters.status) return false;
    if (filters.period?.from && order.date < filters.period.from) return false;
    if (filters.period?.to && order.date > filters.period.to) return false;
    if (filters.sector && client?.sector !== filters.sector) return false;
    return !query || normalizeSearch(client?.company ?? "").includes(query);
  });
}

export function filterClients(
  clients: Client[],
  filters: ClientFilters,
): Client[] {
  const query = normalizeSearch(filters.search);
  return clients.filter(
    (client) =>
      (!filters.sector || filters.sector === client.sector) &&
      (!filters.city || filters.city === client.city) &&
      (!query || normalizeSearch(client.company).includes(query)),
  );
}

export const uniqueValues = <T>(
  items: T[],
  select: (item: T) => string,
): string[] =>
  [...new Set(items.map(select))].sort((a, b) => a.localeCompare(b, "pt"));
