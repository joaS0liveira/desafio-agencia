<<<<<<< Updated upstream
=======
export const ORDER_STATUS = {
  paid: "Paga",
  pending: "Pendente",
  overdue: "Em atraso",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  status: string;
=======
  status: OrderStatus;
>>>>>>> Stashed changes
}

export type OrderStatus = "pago" | "pendente" | "Em atraso";