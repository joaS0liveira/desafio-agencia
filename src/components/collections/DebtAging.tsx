"use client";

import { Pie, PieChart, type PieLabelRenderProps, Tooltip } from "recharts";
import { Panel } from "@/components/ui/Panel";
import type { AgeBucket } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";

// Quanto mais antiga a dívida, mais quente a cor: verde → âmbar → laranja → vermelho.
// As cores vivem em globals.css (--age-*), iguais no modo claro e no escuro.
const colors: Record<string, string> = {
  "0-30": "var(--age-0-30)",
  "31-60": "var(--age-31-60)",
  "61-90": "var(--age-61-90)",
  "90+": "var(--age-90)",
};

/** Uma fatia por faixa (todas com o mesmo ângulo) e o raio a crescer com o valor. */
interface Segment extends AgeBucket {
  weight: number;
  fill: string;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload?: Segment }[];
}) {
  const segment = payload?.[0]?.payload;
  if (!active || !segment) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="flex items-center gap-1.5 font-semibold">
        <i
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ background: segment.fill }}
        />
        {segment.label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {formatEuro(segment.amount)}
      </p>
      <p className="text-muted">
        {segment.count} {segment.count === 1 ? "fatura" : "faturas"} ·{" "}
        {formatPercent(segment.share)} da dívida
      </p>
    </div>
  );
}

const RAD = Math.PI / 180;

/** Percentagem de cada faixa, por fora da ponta da fatia, na cor da fatia. */
function SliceLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, outerRadius, payload } =
    props as PieLabelRenderProps & {
      payload: Segment;
    };
  if (cx == null || cy == null || midAngle == null || outerRadius == null)
    return null;
  const r = Number(outerRadius) + 14;
  const x = Number(cx) + r * Math.cos(-midAngle * RAD);
  const y = Number(cy) + r * Math.sin(-midAngle * RAD);
  return (
    <text
      x={x}
      y={y}
      textAnchor={
        x > Number(cx) + 4 ? "start" : x < Number(cx) - 4 ? "end" : "middle"
      }
      dominantBaseline="central"
      fill={payload.fill}
      fontSize={13}
      fontWeight={700}
    >
      {formatPercent(payload.share)}
    </text>
  );
}

/**
 * Meio-círculo Nightingale: as 4 faixas têm o mesmo ângulo (45°) e o comprimento
 * de cada fatia mostra quanto está em dívida. Da esquerda (mais recente) para a
 * direita (mais antiga). O total fica no canto superior direito; a lista dá os valores.
 */
export function DebtAging({ buckets }: { buckets: AgeBucket[] }) {
  const oldest = buckets
    .filter((f) => f.key === "61-90" || f.key === "90+")
    .reduce((sum, f) => sum + f.share, 0);

  const largest = Math.max(...buckets.map((f) => f.amount), 1);
  const segments: Segment[] = buckets.map((f) => ({
    ...f,
    weight: 1,
    fill: colors[f.key],
  }));
  // O Recharts mede as percentagens a partir de metade da MENOR dimensão (aqui a altura).
  // Com o centro em baixo, o espaço real é metade da largura: daí multiplicar pela
  // proporção do gráfico (como o "120%" do exemplo do Recharts).
  const SCALE = 1.75;
  // Raio entre 45% e 100% do espaço: uma faixa pequena (ou vazia) continua visível
  const radius = (f: Segment) => `${(45 + (f.amount / largest) * 55) * SCALE}%`;
  const total = buckets.reduce((sum, f) => sum + f.amount, 0);

  return (
    <Panel
      className="h-full"
      title="Antiguidade da dívida"
      subtitle={
        oldest > 0
          ? `${formatPercent(oldest)} tem mais de 60 dias`
          : "Nenhuma fatura com mais de 60 dias"
      }
      // Total no canto superior direito, alinhado à direita
      actions={
        <div className="text-right">
          <p className="text-xl leading-tight font-semibold tracking-tight tabular-nums">
            {formatEuro(total)}
          </p>
          <p className="text-xs text-muted">em dívida</p>
        </div>
      }
    >
      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 py-3">
          <PieChart
            responsive
            style={{ width: "100%", aspectRatio: 1.9 }}
            // Margem à volta para os rótulos por fora caberem
            margin={{ top: 24, right: 34, bottom: 0, left: 34 }}
            role="img"
            aria-label={buckets
              .map((f) => `${f.label}: ${formatEuro(f.amount)}`)
              .join(", ")}
          >
            <Pie
              data={segments}
              dataKey="weight"
              nameKey="label"
              cx="50%"
              cy="100%"
              innerRadius={`${22 * SCALE}%`}
              outerRadius={radius}
              // Meio-círculo: da esquerda (mais recente) para a direita (mais antiga)
              startAngle={180}
              endAngle={0}
              label={SliceLabel}
              labelLine={false}
              stroke="var(--surface)"
              strokeWidth={3}
              cornerRadius={4}
            />
            <Tooltip content={ChartTooltip} />
          </PieChart>
        </div>

        <dl className="mt-auto divide-y divide-border">
          {buckets.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-3 py-3 text-[13px]"
            >
              <dt className="flex min-w-0 flex-1 items-center gap-2">
                <i
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: colors[f.key] }}
                />
                {f.label}
                <span className="text-xs text-muted">· {f.count}</span>
              </dt>
              <dd className="w-10 text-right text-xs text-muted tabular-nums">
                {formatPercent(f.share)}
              </dd>
              <dd className="w-24 text-right font-semibold tabular-nums">
                {formatEuro(f.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}
