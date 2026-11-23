import type { ReactNode } from "react";

export function ProportionBar({
  label,
  value,
  ratio,
  highlight = false,
}: {
  label: ReactNode;
  value: string;
  ratio: number;
  highlight?: boolean;
}) {
  return (
    <div className="py-2">
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
        <span className="min-w-0 truncate">{label}</span>
        <strong className="font-semibold tabular-nums">{value}</strong>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-soft">
        <div
          className={`h-full rounded-full ${highlight ? "bg-brand" : "bg-brand/40"}`}
          style={{ width: `${Math.max(ratio * 100, 1.5)}%` }}
        />
      </div>
    </div>
  );
}
