import type { Order } from "@/types";

const millisecondsPerDay = 86_400_000;
const monthFormatter = new Intl.DateTimeFormat("pt-PT", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function daysBetween(start: string, end: string): number {
  return Math.round(
    (parseDate(end).getTime() - parseDate(start).getTime()) /
      millisecondsPerDay,
  );
}

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

// The latest order is the reference for ageing, including for historical datasets.
export function latestDate(orders: Order[]): string | null {
  let latest: string | null = null;
  for (const { date } of orders) {
    if (latest === null || date > latest) latest = date;
  }
  return latest;
}

export function orderMonths(orders: Order[]): string[] {
  if (!orders.length) return [];
  let first = orders[0].date;
  let last = first;
  for (const { date } of orders) {
    if (date < first) first = date;
    if (date > last) last = date;
  }

  const months: string[] = [];
  const cursor = parseDate(`${monthKey(first)}-01`);
  const end = parseDate(last);
  while (cursor <= end) {
    months.push(monthKey(cursor.toISOString()));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return months;
}

export function monthLabel(month: string): string {
  return monthFormatter.format(parseDate(`${month}-01`));
}
