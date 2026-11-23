import { Icon, type IconName } from "@/components/ui/Icon";
import { formatPercent } from "@/lib/format";

// normal (laranja da marca), aviso (âmbar, ex.: só pendente), perigo (vermelho, ex.: em atraso)
export type StatTone = "normal" | "warning" | "danger";

const tones: Record<StatTone, { icon: string; value: string; chart: string }> =
  {
    normal: {
      icon: "bg-primary-soft text-primary-strong",
      value: "",
      chart: "text-brand",
    },
    warning: {
      icon: "bg-warning-soft text-warning",
      value: "text-warning",
      chart: "text-warning",
    },
    danger: {
      icon: "bg-danger-soft text-danger",
      value: "text-danger",
      chart: "text-danger",
    },
  };

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const peak = Math.max(...values, 1);
  const points = values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 38 - (value / peak) * 34;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`h-9 w-20 shrink-0 overflow-visible ${color}`}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Variação face ao período anterior: seta para cima a azul, para baixo a vermelho. */
function Trend({
  value,
  text,
  short,
}: {
  value: number;
  text: string;
  /** Texto visível curto (ex.: "vs set"), para não depender do rato */
  short?: string;
}) {
  const wentUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
        wentUp ? "bg-positive-soft text-positive" : "bg-danger-soft text-danger"
      }`}
      title={text}
    >
      <Icon name={wentUp ? "arrowUp" : "arrowDown"} size={13} />
      <span className="sr-only">{wentUp ? "Subiu" : "Desceu"}</span>
      {formatPercent(Math.abs(value))}
      {short && <span className="font-medium opacity-80">{short}</span>}
    </span>
  );
}

export interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
  icon: IconName;
  tone?: StatTone;
  trend?: { value: number; text: string; short?: string } | null;
  series?: number[];
  compact?: boolean;
}

/** Cartão de indicador (KPI). */
export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = "normal",
  trend,
  series,
  compact = false,
}: StatCardProps) {
  const colors = tones[tone];
  return (
    <article className="card min-w-0 p-4 transition-shadow hover:shadow-card-hover sm:p-5">
      <div
        className={`mb-4 items-center justify-between ${compact ? "hidden sm:flex" : "flex"}`}
      >
        <span
          className={`grid size-9 place-items-center rounded-lg ${colors.icon}`}
        >
          <Icon name={icon} size={19} />
        </span>
        {trend && (
          <Trend value={trend.value} text={trend.text} short={trend.short} />
        )}
      </div>
      <span className="block text-xs text-muted">{label}</span>
      <div className="mt-1 flex items-end justify-between gap-3">
        <strong
          className={`truncate text-2xl font-semibold tracking-tight tabular-nums ${colors.value}`}
        >
          {value}
        </strong>
        {series && <Sparkline values={series} color={colors.chart} />}
      </div>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </article>
  );
}

export function StatGrid({
  children,
  columns = 4,
  compact = false,
}: {
  children: React.ReactNode;
  columns?: 3 | 4;
  /** 2 colunas já no telemóvel, para os cartões não empurrarem o conteúdo para baixo */
  compact?: boolean;
}) {
  return (
    <section
      aria-label="Indicadores"
      className={`grid gap-3 sm:grid-cols-2 ${compact ? "grid-cols-2" : "grid-cols-1"} ${columns === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {children}
    </section>
  );
}
