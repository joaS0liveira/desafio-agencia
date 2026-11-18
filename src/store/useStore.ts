"use client";

import { create } from "zustand";
import type { OrderFilters } from "@/types/filters";
import { emptyOrderFilters } from "../lib/filters.ts";

interface FilterStore {
  filters: OrderFilters;
  setFilter: <K extends keyof OrderFilters>(
    key: K,
    value: OrderFilters[K],
  ) => void;
  resetFilters: () => void;
}

export const useStore = create<FilterStore>((set) => ({
  filters: emptyOrderFilters,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: emptyOrderFilters }),
}));
