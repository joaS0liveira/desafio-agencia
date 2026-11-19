import type { Client, Order } from "@/types";

async function fetchJson<T>(file: string): Promise<T> {
  const response = await fetch(`/data/${file}.json`);
  
  if (!response.ok) {
    throw new Error(`Could not load ${file}.json`);
  }
  return response.json();
}

export const fetchClients = () => fetchJson<Client[]>("clientes");
export const fetchOrders = () => fetchJson<Order[]>("encomendas");

