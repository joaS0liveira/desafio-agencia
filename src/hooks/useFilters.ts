"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { hasActiveFilters, uniqueValues } from "../lib/filters.ts";
import { useStore } from "../store/useStore.ts";
import { ORDER_STATUS } from "../types/index.ts";
import { useAppData } from "./useAppData";

export function useFilters() {
  // Só estes três campos: sem o seletor, qualquer mudança na store voltava a desenhar os filtros
  const { filters, setFilter, resetFilters } = useStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilter: state.setFilter,
      resetFilters: state.resetFilters,
    })),
  );
  const { clients, orders, loading } = useAppData();

  const options = useMemo(
    () => ({
      services: uniqueValues(orders, (order) => order.service),
      sectors: uniqueValues(clients, (client) => client.sector),
      statuses: Object.values(ORDER_STATUS),
    }),
    [clients, orders],
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
