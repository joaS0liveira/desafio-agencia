"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { clientSummary, ordersForClient } from "@/lib/clients";
import { filterClients, uniqueValues } from "@/lib/filters";
import { totals } from "@/lib/stats";
import type { ClientFilters } from "@/types/filters";
import { useAppData } from "./useAppData";

export type ClientSort = "billed" | "open" | "inactive" | "name";

/** Vistas rápidas: todos, só quem deve, só quem está parado há mais de 90 dias. */
export type ClientView = "all" | "open" | "inactive";

/** Quantos clientes aparecem em cada página. */
export const CLIENTS_PER_PAGE = 9;

const INACTIVE_DAYS = 90;

const inView = (
  view: ClientView,
  summary: { open: number; daysSinceLastOrder: number | null },
) =>
  view === "open"
    ? summary.open > 0
    : view === "inactive"
      ? (summary.daysSinceLastOrder ?? 0) > INACTIVE_DAYS
      : true;

interface ClientsState {
  filters: ClientFilters;
  sort: ClientSort;
  view: ClientView;
  page: number;
  patch: (changes: Partial<Omit<ClientsState, "patch">>) => void;
}

/**
 * As escolhas da lista de clientes ficam numa store própria (Zustand), para
 * não se perderem quando se abre um cliente e se volta atrás.
 */
const useClientsState = create<ClientsState>((set) => ({
  filters: { search: "", sector: null, city: null },
  sort: "billed",
  view: "all",
  page: 1,
  patch: (changes) => set(changes),
}));

/** Lista de clientes com o resumo de cada um, pesquisa, filtros, ordenação e páginas. */
export function useClients() {
  const { clients, orders, loading } = useAppData();
  const { filters, sort, view, page, patch } = useClientsState();
  const setFilters = (update: (current: ClientFilters) => ClientFilters) =>
    patch({ filters: update(filters) });
  const setSortState = (value: ClientSort) => patch({ sort: value });
  const setViewState = (value: ClientView) => patch({ view: value });
  const setPage = (value: number) => patch({ page: value });

  const data = useMemo(() => {
    const filtered = filterClients(clients, filters).map((client) => {
      const clientOrders = ordersForClient(orders, client.id);
      const { overdue, pending } = totals(clientOrders);
      return {
        client,
        summary: clientSummary(clientOrders, orders),
        // Para pintar "Em aberto" com a regra única (atraso a vermelho, pendente a âmbar)
        debt: { overdue, pending },
      };
    });
    // As contagens de cada vista respeitam a pesquisa, o setor e a cidade
    const viewCounts: Record<ClientView, number> = {
      all: filtered.length,
      open: filtered.filter((c) => inView("open", c.summary)).length,
      inactive: filtered.filter((c) => inView("inactive", c.summary)).length,
    };
    const list = filtered.filter((c) => inView(view, c.summary));

    list.sort((a, b) => {
      switch (sort) {
        case "open":
          return b.summary.open - a.summary.open;
        case "inactive":
          return (
            (b.summary.daysSinceLastOrder ?? 0) -
            (a.summary.daysSinceLastOrder ?? 0)
          );
        case "name":
          return a.client.company.localeCompare(b.client.company, "pt");
        default:
          return b.summary.billed - a.summary.billed;
      }
    });

    return {
      list,
      viewCounts,
      sectors: uniqueValues(clients, (c) => c.sector),
      cities: uniqueValues(clients, (c) => c.city),
    };
  }, [clients, orders, filters, sort, view]);

  // Páginas de 9 clientes. Se os filtros encolherem a lista, nunca fica numa página vazia.
  const totalPages = Math.max(
    1,
    Math.ceil(data.list.length / CLIENTS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * CLIENTS_PER_PAGE;

  return {
    loading,
    ...data,
    pageItems: data.list.slice(start, start + CLIENTS_PER_PAGE),
    page: currentPage,
    totalPages,
    range: {
      from: data.list.length ? start + 1 : 0,
      to: Math.min(start + CLIENTS_PER_PAGE, data.list.length),
    },
    setPage,
    total: clients.length,
    filters,
    // Mudar filtros ou ordenação volta sempre à página 1
    setFilter: <K extends keyof ClientFilters>(
      key: K,
      value: ClientFilters[K],
    ) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setPage(1);
    },
    resetFilters: () => {
      setFilters(() => ({ search: "", sector: null, city: null }));
      setViewState("all");
      setPage(1);
    },
    hasFilters: Boolean(
      filters.search || filters.sector || filters.city || view !== "all",
    ),
    view,
    setView: (value: ClientView) => {
      setViewState(value);
      setPage(1);
    },
    sort,
    setSort: (value: ClientSort) => {
      setSortState(value);
      setPage(1);
    },
  };
}
