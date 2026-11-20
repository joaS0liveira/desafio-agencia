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

const MESES = [
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
function mesCurto(mes: string, comAno = false) {
  const nome = MESES.at(Number(mes.slice(5, 7)) - 1) ?? mes;
  return comAno ? `${nome} ${mes.slice(2, 4)}` : nome;
}

function Dica({
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
      <p className="text-muted">{mesCurto(String(label), true)}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {formatEuro(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  );
}

const eixo = {
  stroke: "var(--muted)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

/**
 * Valores do eixo sem repetidos: 12k, 1,5k, 800.
 * (Arredondar sempre aos milhares dava "0 · 1k · 1k · 2k" com valores pequenos.)
 */
function valorEixo(v: number): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 10_000) return formatThousands(v);
  if (Math.abs(v) >= 1_000)
    return `${(v / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 })}k`;
  return String(Math.round(v));
}

/** Faturação por mês. "area" para a evolução da agência, "barras" para um cliente. */
export function GraficoMeses({
  dados,
  tipo = "area",
  altura = 280,
  media,
  destaque = [],
}: {
  dados: MonthRevenue[];
  tipo?: "area" | "barras";
  altura?: number;
  /** Faturação média por mês: desenha uma linha tracejada de referência */
  media?: number;
  /** Meses ("AAAA-MM") do período escolhido: ficam a verde e o resto a cinzento */
  destaque?: string[];
}) {
  const gradiente = useId();
  // Com média, deixa espaço à direita para o rótulo não tapar a linha
  const margem = { top: 8, right: media ? 64 : 16, left: 0 };
  const comDestaque = destaque.length > 0;
  const serie = comDestaque
    ? dados.map((d) => ({
        ...d,
        destaque: destaque.includes(d.month) ? d.revenue : null,
      }))
    : dados;

  const comum = (
    <>
      <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
      <XAxis dataKey="month" tickFormatter={(m) => mesCurto(m)} {...eixo} />
      <YAxis
        tickFormatter={valorEixo}
        allowDecimals={false}
        width={44}
        {...eixo}
      />
      <Tooltip
        content={Dica}
        cursor={{ fill: "var(--surface-soft)", stroke: "var(--border)" }}
      />
      {media ? (
        <ReferenceLine
          y={media}
          stroke="var(--muted)"
          strokeDasharray="4 4"
          ifOverflow="extendDomain"
          label={{
            value: `média ${valorEixo(media)}`,
            position: "right",
            fill: "var(--muted)",
            fontSize: 11,
          }}
        />
      ) : null}
    </>
  );

  return (
    <div style={{ height: altura }} className="w-full px-2 pb-3">
      <ResponsiveContainer width="100%" height="100%">
        {tipo === "area" ? (
          <AreaChart data={serie} margin={margem}>
            <defs>
              <linearGradient id={gradiente} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--accent)"
                  stopOpacity={0.28}
                />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {comum}
            {/* Sem período: a linha verde é o ano todo. Com período: o ano fica a cinzento
                para comparar e só o período escolhido fica a verde. */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={comDestaque ? "var(--border)" : "var(--primary)"}
              strokeWidth={2}
              fill={comDestaque ? "none" : `url(#${gradiente})`}
              dot={
                comDestaque
                  ? { r: 2.5, fill: "var(--surface)", stroke: "var(--border)" }
                  : { r: 3, fill: "var(--surface)", strokeWidth: 2 }
              }
              activeDot={{
                r: 5,
                fill: comDestaque ? "var(--muted)" : "var(--primary)",
                strokeWidth: 0,
              }}
              isAnimationActive={!comDestaque}
            />
            {comDestaque && (
              <Area
                type="monotone"
                dataKey="destaque"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill={`url(#${gradiente})`}
                connectNulls={false}
                dot={{
                  r: 4,
                  fill: "var(--primary)",
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        ) : (
          <BarChart data={dados} margin={margem}>
            {comum}
            <Bar
              dataKey="revenue"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
