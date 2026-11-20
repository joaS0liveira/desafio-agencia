import type { ReactNode } from "react";

export function BarraProporcional({
  rotulo,
  valor,
  proporcao,
  destaque = false,
}: {
  rotulo: ReactNode;
  valor: string;
  proporcao: number;
  destaque?: boolean;
}) {
  return (
    <div className="py-2">
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
        <span className="min-w-0 truncate">{rotulo}</span>
        <strong className="font-semibold tabular-nums">{valor}</strong>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-soft">
        <div
          className={`h-full rounded-full ${destaque ? "bg-primary" : "bg-accent/55"}`}
          style={{ width: `${Math.max(proporcao * 100, 1.5)}%` }}
        />
      </div>
    </div>
  );
}
