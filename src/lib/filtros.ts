import { Client, Order, OrderStatus } from "@/types";

export interface Period {
  from: string | null; // "2026-01-01"
  to: string | null;
}

export interface OrderFilters {
  search: string;
  period: Period | null;
  service: string | null;
  status: OrderStatus | null;
  sector: string | null;
}

export const emptyOrderFilters: OrderFilters = {
  search: "",
  period: null,
  service: null,
  status: null,
  sector: null,
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function filterOrders(
  orders: Order[],
  clients: Client[],
  f: OrderFilters
): Order[] {
  const byId = new Map(clients.map((c) => [c.id, c]));
  const q = norm(f.search);

  return orders.filter((o) => {
    const client = byId.get(o.client_id);

    if (f.service && o.service !== f.service) return false;
    if (f.status && o.status !== f.status) return false;
    if (f.period?.from && o.date < f.period.from) return false;
    if (f.period?.to && o.date > f.period.to) return false;
    if (f.sector && client?.sector !== f.sector) return false;
    if (q && !norm(client?.company ?? "").includes(q)) return false;

    return true;
  });
}

// ---- Lista de clientes ----

export interface ClientFilters {
  search: string;
  sector: string | null;
  city: string | null;
}

export function filterClients(clients: Client[], f: ClientFilters): Client[] {
  const q = norm(f.search);
  return clients.filter((c) => {
    if (f.sector && c.sector !== f.sector) return false;
    if (f.city && c.city !== f.city) return false;
    if (q && !norm(c.company).includes(q)) return false;
    return true;
  });
}

// Para popular os <select> de setor/cidade/serviço
export const uniqueValues = <T>(items: T[], pick: (i: T) => string): string[] =>
  [...new Set(items.map(pick))].sort((a, b) => a.localeCompare(b, "pt"));

