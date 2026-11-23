import { ORDER_STATUS, type OrderStatus } from "@/types";

const styles: Record<OrderStatus, string> = {
  [ORDER_STATUS.paid]: "bg-positive-soft text-positive",
  [ORDER_STATUS.pending]: "bg-warning-soft text-warning",
  [ORDER_STATUS.overdue]: "bg-danger-soft text-danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
        ${styles[status]}`}
    >
      <i className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
