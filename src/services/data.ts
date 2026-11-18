import type { Client, Order } from "@/types";
<<<<<<< Updated upstream

async function fetchJson<T>(file: string): Promise<T> {
  const response = await fetch(`/data/${file}.json`);
  if (!response.ok) {
    throw new Error(`Could not load ${file}.json`);
  }
  return response.json();
}

export const fetchSales = () => fetchJson<Order[]>("encomendas");
export const fetchProducts = () => fetchJson<Client[]>("clientes");
=======
import clientData from "../data/clientes.json" with { type: "json" };
import orderData from "../data/encomendas.json" with { type: "json" };

export const clients: Client[] = clientData;
export const orders = orderData as Order[];

export const fetchClients = async (): Promise<Client[]> => clients;
export const fetchOrders = async (): Promise<Order[]> => orders;
>>>>>>> Stashed changes
