import type { Client, Order } from "@/types";
import clientes from "@/data/clientes.json";
import encomendas from "@/data/encomendas.json";

export const fetchClients = async (): Promise<Client[]> => clientes as Client[];
export const fetchOrders = async (): Promise<Order[]> => encomendas as Order[];
