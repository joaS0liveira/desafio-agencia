"use client";

import { create } from "zustand";
import type { Client, Order } from "@/types";
import type { OrderFilters } from "@/types/filters";
import { emptyOrderFilters } from "../lib/filters";
import { fetchClients, fetchOrders } from "../services/data";

interface AppStore {
  // Filtros
  filters: OrderFilters;
  setFilter: <K extends keyof OrderFilters>(
    key: K,
    value: OrderFilters[K],
  ) => void;
  resetFilters: () => void;

  // Dados globais (carregados 1 vez)
  clients: Client[];
  orders: Order[];
  loading: boolean;
  initialized: boolean;
  loadData: () => Promise<void>;
}

export const useStore = create<AppStore>((set, get) => ({
  filters: emptyOrderFilters,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: emptyOrderFilters }),

  clients: [],
  orders: [],
  loading: true,
  initialized: false,

  loadData: async () => {
    // Se já carregou ou está a carregar, não repete o fetch
    if (get().initialized) return;
    set({ initialized: true, loading: true });

    try {
      const [clients, orders] = await Promise.all([
        fetchClients(),
        fetchOrders(),
      ]);
      set({ clients, orders, loading: false });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      set({ loading: false, initialized: false });
    }
  },
}));

