import type {
  MonthChange,
  MonthRevenue,
  OrderTotals,
  ServiceRevenue,
} from "@/types/reports";
import { ORDER_STATUS, type Order } from "../types/index.ts";
import { monthKey } from "./dates.ts";

export function sumOrderAmounts(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.amount, 0);
}

export function revenueByKey<K>(
  orders: Order[],
  keyOf: (order: Order) => K,
): Map<K, number> {
  const revenue = new Map<K, number>();
  for (const order of orders) {
    const key = keyOf(order);
    revenue.set(key, (revenue.get(key) ?? 0) + order.amount);
  }
  return revenue;
}

export function totals(orders: Order[]): OrderTotals {
  let billed = 0;
  let received = 0;
  let overdue = 0;
  let pending = 0;
  let overdueCount = 0;
  let pendingCount = 0;
  for (const { status, amount } of orders) {
    billed += amount;
    switch (status) {
      case ORDER_STATUS.paid:
        received += amount;
        break;
      case ORDER_STATUS.overdue:
        overdue += amount;
        overdueCount++;
        break;
      case ORDER_STATUS.pending:
        pending += amount;
        pendingCount++;
        break;
    }
  }
  return {
    billed,
    received,
    overdue,
    pending,
    open: overdue + pending,
    overdueCount,
    pendingCount,
    orderCount: orders.length,
    averageTicket: orders.length ? billed / orders.length : 0,
    collectionRate: billed ? received / billed : 0,
  };
}

export function revenueByMonth(
  orders: Order[],
  months?: string[],
): MonthRevenue[] {
  const revenue = revenueByKey(orders, (order) => monthKey(order.date));
  return (months ?? [...revenue.keys()].sort()).map((month) => ({
    month,
    revenue: revenue.get(month) ?? 0,
  }));
}

export function revenueByService(orders: Order[]): ServiceRevenue[] {
  const services = new Map<string, ServiceRevenue>();
  for (const { service, amount } of orders) {
    const entry = services.get(service);
    if (entry) {
      entry.revenue += amount;
      entry.count++;
    } else {
      services.set(service, { service, revenue: amount, count: 1 });
    }
  }
  return [...services.values()].sort((a, b) => b.revenue - a.revenue);
}

export const averageTicketByService = (orders: Order[]) =>
  revenueByService(orders).map(({ service, revenue, count }) => ({
    service,
    average: revenue / count,
  }));

export function monthOverMonth(series: MonthRevenue[]): MonthChange[] {
  return series.map((month, index) => {
    const previous = series[index - 1]?.revenue;
    return {
      ...month,
      change: previous ? (month.revenue - previous) / previous : null,
    };
  });
}
