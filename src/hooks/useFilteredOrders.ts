"use client";

import { useMemo } from "react";
import { filterOrders } from "../lib/filters.ts";
import { totals } from "../lib/stats.ts";
import { clients, orders } from "../services/data.ts";
import { useStore } from "../store/useStore.ts";

export function useFilteredOrders() {
  const filters = useStore((state) => state.filters);
  return useMemo(() => {
    const filtered = filterOrders(orders, clients, filters);
    return {
      orders: filtered,
      totals: totals(filtered),
      count: filtered.length,
      isEmpty: filtered.length === 0,
    };
  }, [filters]);
}
