"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatEuro, formatThousands } from "@/lib/format";
import type { MonthRevenue } from "@/types/reports";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** "2026-04" -> "abr" (ou "abr 26" quando `comAno`) */
function shortMonth(month: string, withYear = false) {
  const name = MONTHS.at(Number(month.slice(5, 7)) - 1) ?? month;
  return withYear ? `${name} ${month.slice(2, 4)}` : name;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: readonly { value?: unknown }[];
  label?: unknown;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="text-muted">{shortMonth(String(label), true)}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {formatEuro(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  );
}

const axis = {
  stroke: "var(--muted)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

/**
 * Valores do eixo sem repetidos: 12k, 1,5k, 800.
 * (Arredondar sempre aos milhares dava "0 · 1k · 1k · 2k" com valores pequenos.)
 */
function axisValue(v: number): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 10_000) return formatThousands(v);
  if (Math.abs(v) >= 1_000)
    return `${(v / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 })}k`;
  return String(Math.round(v));
}

/** Faturação por mês. "area" para a evolução da agência, "barras" para um cliente. */
export function MonthlyChart({
  data,
  kind = "area",
  height = 280,
  average,
  highlight = [],
}: {
  data: MonthRevenue[];
  kind?: "area" | "barras";
  height?: number;
  /** Faturação média por mês: desenha uma linha tracejada de referência */
  average?: number;
  /** Meses ("AAAA-MM") do período escolhido: ficam a laranja e o resto a cinzento */
  highlight?: string[];
}) {
  const gradient = useId();
  // Com média, deixa espaço à direita para o rótulo não tapar a linha
  const margem = { top: 8, right: average ? 64 : 16, left: 0 };
  const hasHighlight = highlight.length > 0;
  const series = hasHighlight
    ? data.map((d) => ({
        ...d,
        highlight: highlight.includes(d.month) ? d.revenue : null,
      }))
    : data;

  const sharedAxes = (
    <>
      <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
      <XAxis dataKey="month" tickFormatter={(m) => shortMonth(m)} {...axis} />
      <YAxis
        tickFormatter={axisValue}
        allowDecimals={false}
        width={44}
        {...axis}
      />
      <Tooltip
        content={ChartTooltip}
        cursor={{ fill: "var(--surface-soft)", stroke: "var(--border)" }}
      />
      {average ? (
        <ReferenceLine
          y={average}
          stroke="var(--muted)"
          strokeDasharray="4 4"
          ifOverflow="extendDomain"
          label={{
            value: `média ${axisValue(average)}`,
            position: "right",
            fill: "var(--muted)",
            fontSize: 11,
          }}
        />
      ) : null}
    </>
  );

  return (
    <div style={{ height: height }} className="w-full px-2 pb-3">
      <ResponsiveContainer width="100%" height="100%">
        {kind === "area" ? (
          <AreaChart data={series} margin={margem}>
            <defs>
              <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--accent)"
                  stopOpacity={0.28}
                />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {sharedAxes}
            {/* Sem período: a linha laranja é o ano todo. Com período: o ano fica a cinzento
                para comparar e só o período escolhido fica a laranja. */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={hasHighlight ? "var(--border)" : "var(--brand)"}
              strokeWidth={2}
              fill={hasHighlight ? "none" : `url(#${gradient})`}
              dot={
                hasHighlight
                  ? { r: 2.5, fill: "var(--surface)", stroke: "var(--border)" }
                  : { r: 3, fill: "var(--surface)", strokeWidth: 2 }
              }
              activeDot={{
                r: 5,
                fill: hasHighlight ? "var(--muted)" : "var(--brand)",
                strokeWidth: 0,
              }}
              isAnimationActive={!hasHighlight}
            />
            {hasHighlight && (
              <Area
                type="monotone"
                dataKey="highlight"
                stroke="var(--brand)"
                strokeWidth={2.5}
                fill={`url(#${gradient})`}
                connectNulls={false}
                dot={{
                  r: 4,
                  fill: "var(--brand)",
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        ) : (
          <BarChart data={data} margin={margem}>
            {sharedAxes}
            <Bar
              dataKey="revenue"
              fill="var(--brand)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
