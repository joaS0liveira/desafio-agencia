"use client";

import { useMemo } from "react";
import { filterOrders } from "../lib/filters.ts";
import { totals } from "../lib/stats.ts";
import { useStore } from "../store/useStore.ts";
import { useAppData } from "./useAppData.ts";

export function useFilteredOrders() {
  const filters = useStore((state) => state.filters);
  const { clients, orders, loading } = useAppData();

  return useMemo(() => {
    const filtered = loading ? [] : filterOrders(orders, clients, filters);
    return {
      loading,
      orders: filtered,
      totals: totals(filtered),
      count: filtered.length,
      isEmpty: !loading && filtered.length === 0,
    };
  }, [filters, clients, orders, loading]);
}
