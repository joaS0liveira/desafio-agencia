"use client";

import { useEffect } from "react";
import { useStore } from "../store/useStore";

export function useAppData() {
  const clients = useStore((state) => state.clients);
  const orders = useStore((state) => state.orders);
  const loading = useStore((state) => state.loading);
  const loadData = useStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { clients, orders, loading };
}
