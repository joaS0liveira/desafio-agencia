"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { toCsv } from "@/lib/actions";
import {
  collectionRows,
  collectionSummary,
  filterCollections,
  sortCollections,
} from "@/lib/collections";
import { ageBuckets, debtorsByClient, sortByPriority } from "@/lib/debtors";
import { uniqueValues } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { sumOrderAmounts } from "@/lib/stats";
import type { OrderStatus } from "@/types";
import type { CollectionSort } from "@/types/reports";
import { useAppData } from "./useAppData";

/** "priority" = atrasos primeiro, depois por valor. É a ordem por defeito. */
export type CollectionsSort = CollectionSort | "priority";

/**
 * Filtros e ordenação de Cobranças numa store própria (Zustand), para não se
 * perderem quando se abre um cliente e se volta atrás.
 */
const useCollectionsFilters = create<{
  status: OrderStatus | null;
  service: string | null;
  sort: CollectionsSort;
  setStatus: (status: OrderStatus | null) => void;
  setService: (service: string | null) => void;
  setSort: (sort: CollectionsSort) => void;
  reset: () => void;
}>((set) => ({
  status: null,
  service: null,
  sort: "priority",
  setStatus: (status) => set({ status }),
  setService: (service) => set({ service }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ status: null, service: null }),
}));

/** Dados e escolhas do ecrã "Cobranças". Os filtros são só deste ecrã. */
export function useCollections() {
  const { clients, orders, loading } = useAppData();
  const { status, service, sort, setStatus, setService, setSort, reset } =
    useCollectionsFilters();

  const data = useMemo(() => {
    const all = collectionRows(orders, clients);
    const filtered = filterCollections(all, status, service);
    const rows =
      sort === "priority"
        ? sortByPriority(filtered)
        : sortCollections(filtered, sort);
    const summary = collectionSummary(orders);
    const billed = sumOrderAmounts(orders);

    return {
      summary,
      // Parte do faturado que ainda está por receber (0 a 1)
      openShare: billed ? summary.totalOpen / billed : 0,
      rows,
      total: filtered.reduce((sum, row) => sum + row.order.amount, 0),
      debtors: debtorsByClient(filtered),
      buckets: ageBuckets(filtered),
      services: uniqueValues(all, (row) => row.order.service),
      csv: toCsv(
        rows.map(({ order, client, daysOutstanding }) => ({
          client: client?.company ?? "",
          email: client?.email ?? "",
          service: order.service,
          date: formatDate(order.date),
          days: daysOutstanding,
          amount: order.amount,
          status: order.status,
        })),
        [
          ["client", "Cliente"],
          ["email", "Email"],
          ["service", "Serviço"],
          ["date", "Emitida em"],
          ["days", "Dias"],
          ["amount", "Valor (€)"],
          ["status", "Estado"],
        ],
      ),
    };
  }, [clients, orders, status, service, sort]);

  return {
    loading,
    ...data,
    status,
    setStatus,
    service,
    setService,
    sort,
    setSort,
    hasFilters: Boolean(status || service),
    resetFilters: reset,
  };
}
