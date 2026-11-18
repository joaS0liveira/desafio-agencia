import type { Client, Order } from "@/types";

async function fetchJson<T>(file: string): Promise<T> {
  const response = await fetch(`/data/${file}.json`);
  if (!response.ok) {
    throw new Error(`Could not load ${file}.json`);
  }
  return response.json();
}

export const fetchSales = () => fetchJson<Order[]>("encomendas");
export const fetchProducts = () => fetchJson<Client[]>("clientes");