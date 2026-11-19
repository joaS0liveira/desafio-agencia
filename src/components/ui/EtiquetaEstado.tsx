import { ORDER_STATUS, type OrderStatus } from "@/types";

const estilos: Record<OrderStatus, string> = {
  [ORDER_STATUS.paid]: "bg-primary-soft text-primary-strong",
  [ORDER_STATUS.pending]: "bg-warning-soft text-warning",
  [ORDER_STATUS.overdue]: "bg-danger-soft text-danger",
};

export function EtiquetaEstado({ estado }: { estado: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
        ${estilos[estado]}`}
    >
      <i className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {estado}
    </span>
  );
}
