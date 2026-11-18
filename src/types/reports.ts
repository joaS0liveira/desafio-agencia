import type { Client, Order } from "./index";

export interface OrderTotals {
  billed: number;
  received: number;
  open: number;
  overdue: number;
  pending: number;
  overdueCount: number;
  pendingCount: number;
  orderCount: number;
  averageTicket: number;
  collectionRate: number;
}

export interface MonthRevenue {
  month: string;
  revenue: number;
}

export interface MonthChange extends MonthRevenue {
  change: number | null;
}

export interface ServiceRevenue {
  service: string;
  revenue: number;
  count: number;
}

export interface ClientRevenue {
  client: Client;
  revenue: number;
  share: number;
}

export interface ClientSummary {
  billed: number;
  orderCount: number;
  averageTicket: number;
  open: number;
  openOrderCount: number;
  agencySharePercent: number;
  lastOrderDate: string | null;
  daysSinceLastOrder: number | null;
}

export interface InactiveClient {
  client: Client;
  lastOrderDate: string | null;
  daysSinceLastOrder: number;
}

export interface CollectionRow {
  order: Order;
  client: Client | undefined;
  daysOutstanding: number;
}

export type CollectionSort = "amount" | "days" | "date" | "client";

export interface CollectionSummary {
  overdue: { amount: number; count: number };
  pending: { amount: number; count: number };
  totalOpen: number;
  clientsWithOpenOrders: number;
}
