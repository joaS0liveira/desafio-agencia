"use client";

import { useMemo } from "react";
import { monthLabel, orderMonths, parseDate } from "../lib/dates.ts";
import { hasActiveFilters, uniqueValues } from "../lib/filters.ts";
import { useAppData } from "./useAppData";
import { useStore } from "../store/useStore.ts";
import { ORDER_STATUS } from "../types/index.ts";

export function useFilters() {
  const { filters, setFilter, resetFilters } = useStore();
  const { clients, orders, loading } = useAppData();

  const options = useMemo(
    () => ({
      periods: [
        { value: null, label: "Todo o período" },
        ...orderMonths(orders).map((month) => {
          const from = `${month}-01`;
          const end = parseDate(from);
          end.setUTCMonth(end.getUTCMonth() + 1, 0);
          return {
            value: { from, to: end.toISOString().slice(0, 10) },
            label: monthLabel(month),
          };
        }),
      ],
      services: uniqueValues(orders, (order) => order.service),
      sectors: uniqueValues(clients, (client) => client.sector),
      statuses: Object.values(ORDER_STATUS),
    }),
    [clients, orders]
  );

  return {
    loading,
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters: hasActiveFilters(filters),
    options,
  };
}
