import type { Order } from "@/types";
import type { DateRange } from "@/types/filters";
import {
  latestDate,
  monthKey,
  monthLabel,
  orderMonths,
  parseDate,
} from "./dates.ts";

// Períodos para o filtro da Visão geral: atalhos, trimestres e meses.
// Tudo é relativo à última encomenda registada (não à data de hoje).

export interface PeriodOption {
  key: string;
  label: string;
  value: DateRange | null;
}

export interface PeriodGroup {
  label: string;
  options: PeriodOption[];
}

const iso = (date: Date) => date.toISOString().slice(0, 10);

function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return iso(d);
}

/** Primeiro dia do mês `offset` meses antes do mês de `date`. */
function monthStart(date: string, offset = 0): string {
  const d = parseDate(`${monthKey(date)}-01`);
  d.setUTCMonth(d.getUTCMonth() - offset);
  return iso(d);
}

/** Último dia do mês "AAAA-MM". */
function monthEnd(month: string): string {
  const d = parseDate(`${month}-01`);
  d.setUTCMonth(d.getUTCMonth() + 1, 0);
  return iso(d);
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export function periodGroups(orders: Order[]): PeriodGroup[] {
  const last = latestDate(orders);
  const months = orderMonths(orders);
  if (!last || !months.length) {
    return [
      {
        label: "",
        options: [{ key: "all", label: "Todo o período", value: null }],
      },
    ];
  }

  const quick: PeriodOption[] = [
    { key: "all", label: "Todo o período", value: null },
    {
      key: "30d",
      label: "Últimos 30 dias",
      value: { from: addDays(last, -29), to: last },
    },
    {
      key: "3m",
      label: "Últimos 3 meses",
      value: { from: monthStart(last, 2), to: last },
    },
    {
      key: "6m",
      label: "Últimos 6 meses",
      value: { from: monthStart(last, 5), to: last },
    },
    {
      key: "ytd",
      label: `${last.slice(0, 4)} até agora`,
      value: { from: `${last.slice(0, 4)}-01-01`, to: last },
    },
  ];

  // Trimestres que têm pelo menos um mês com dados
  const quarters = new Map<string, PeriodOption>();
  for (const month of months) {
    const year = month.slice(0, 4);
    const q = Math.floor((Number(month.slice(5, 7)) - 1) / 3) + 1;
    const key = `${year}-T${q}`;
    if (quarters.has(key)) continue;
    const firstMonth = `${year}-${String((q - 1) * 3 + 1).padStart(2, "0")}`;
    const lastMonth = `${year}-${String(q * 3).padStart(2, "0")}`;
    quarters.set(key, {
      key,
      label: `${q}.º trimestre de ${year}`,
      value: { from: `${firstMonth}-01`, to: monthEnd(lastMonth) },
    });
  }

  const monthOptions: PeriodOption[] = [...months].reverse().map((month) => ({
    key: month,
    label: capitalize(monthLabel(month)),
    value: { from: `${month}-01`, to: monthEnd(month) },
  }));

  return [
    { label: "Atalhos", options: quick },
    { label: "Trimestres", options: [...quarters.values()].reverse() },
    { label: "Meses", options: monthOptions },
  ];
}

/** A opção que corresponde ao período escolhido (ou null se não houver nenhuma igual). */
export function findPeriod(
  groups: PeriodGroup[],
  period: DateRange | null,
): PeriodOption | null {
  for (const group of groups) {
    for (const option of group.options) {
      if (
        (option.value === null && !period) ||
        (option.value &&
          period &&
          option.value.from === period.from &&
          option.value.to === period.to)
      ) {
        return option;
      }
    }
  }
  return null;
}

/** Os meses ("AAAA-MM") que caem dentro do período. */
export function monthsInPeriod(
  months: string[],
  period: DateRange | null,
): string[] {
  if (!period) return months;
  const from = period.from ? monthKey(period.from) : null;
  const to = period.to ? monthKey(period.to) : null;
  return months.filter(
    (month) => (!from || month >= from) && (!to || month <= to),
  );
}
