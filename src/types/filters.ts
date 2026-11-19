import type { OrderStatus } from "./index";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface OrderFilters {
  search: string;
  period: DateRange | null;
  service: string | null;
  status: OrderStatus | null;
  sector: string | null;
}

export interface ClientFilters {
  search: string;
  sector: string | null;
  city: string | null;
}
