import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Mensagem quando não há nada para mostrar (sem resultados, cliente inexistente…). */
export function EmptyState({
  title,
  text,
  icon = "search",
  action,
}: {
  title: string;
  text?: string;
  icon?: IconName;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-surface-soft text-muted">
        <Icon name={icon} />
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Indicador pequeno de espera: três barras laranja a subir e descer (ver .barras-espera). */
export function LoadingBars({ className = "" }: { className?: string }) {
  return (
    <span className={`loading-bars ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/** Esqueleto da página enquanto os dados chegam: título, cartões e um gráfico. */
export function PageSkeleton() {
  return (
    <output
      aria-busy="true"
      aria-label="A carregar dados"
      className="block space-y-6"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2.5">
          <div className="skeleton h-3 w-24 rounded-md" />
          <div className="skeleton h-8 w-64 max-w-full rounded-lg" />
        </div>
        <LoadingBars />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="card space-y-4 p-5">
            <div className="skeleton size-9 rounded-lg" />
            <div className="skeleton h-3 w-20 rounded-md" />
            <div className="skeleton h-6 w-32 rounded-md" />
          </div>
        ))}
      </div>
      {/* Gráfico a carregar: barras de alturas diferentes, como as do símbolo */}
      <div className="card flex h-80 items-end gap-3 p-6">
        {[38, 52, 44, 63, 58, 74, 66, 82].map((height) => (
          <div
            key={height}
            className="skeleton flex-1 rounded-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </output>
  );
}
