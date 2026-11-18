export interface Client {
  id: number;
  company: string;
  sector: string;
  city: string;
  contact_name: string;
  email: string;
  phone: string;
  customer_since: string;
}

export interface Order {
  id: number;
  client_id: number;
  date: string;
  service: string;
  amount: number;
  status: string;
}

export type OrderStatus = "pago" | "pendente" | "Em atraso";