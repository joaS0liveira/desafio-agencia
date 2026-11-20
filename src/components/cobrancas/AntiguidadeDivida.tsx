"use client";

import { Pie, PieChart, type PieLabelRenderProps, Tooltip } from "recharts";
import { Bloco } from "@/components/ui/Bloco";
import type { AgeBucket } from "@/lib/debtors";
import { formatEuro, formatPercent } from "@/lib/format";

// Quanto mais antiga a dívida, mais quente a cor: verde → âmbar → laranja → vermelho.
// Cores fixas de gráfico (não de texto), legíveis no modo claro e no escuro.
const cores: Record<string, string> = {
  "0-30": "#2ba84a",
  "31-60": "#e2a919",
  "61-90": "#e8702a",
  "90+": "#d92d20",
};

/** Uma fatia por faixa (todas com o mesmo ângulo) e o raio a crescer com o valor. */
interface Fatia extends AgeBucket {
  peso: number;
  fill: string;
}

function Dica({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload?: Fatia }[];
}) {
  const fatia = payload?.[0]?.payload;
  if (!active || !fatia) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="flex items-center gap-1.5 font-semibold">
        <i
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ background: fatia.fill }}
        />
        {fatia.label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {formatEuro(fatia.amount)}
      </p>
      <p className="text-muted">
        {fatia.count} {fatia.count === 1 ? "fatura" : "faturas"} ·{" "}
        {formatPercent(fatia.share)} da dívida
      </p>
    </div>
  );
}

const RAD = Math.PI / 180;

/** Percentagem de cada faixa, por fora da ponta da fatia, na cor da fatia. */
function Rotulo(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, outerRadius, payload } =
    props as PieLabelRenderProps & {
      payload: Fatia;
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
export function AntiguidadeDivida({ faixas }: { faixas: AgeBucket[] }) {
  const antiga = faixas
    .filter((f) => f.key === "61-90" || f.key === "90+")
    .reduce((soma, f) => soma + f.share, 0);

  const maior = Math.max(...faixas.map((f) => f.amount), 1);
  const fatias: Fatia[] = faixas.map((f) => ({
    ...f,
    peso: 1,
    fill: cores[f.key],
  }));
  // O Recharts mede as percentagens a partir de metade da MENOR dimensão (aqui a altura).
  // Com o centro em baixo, o espaço real é metade da largura: daí multiplicar pela
  // proporção do gráfico (como o "120%" do exemplo do Recharts).
  const ESCALA = 1.75;
  // Raio entre 45% e 100% do espaço: uma faixa pequena (ou vazia) continua visível
  const raio = (f: Fatia) => `${(45 + (f.amount / maior) * 55) * ESCALA}%`;
  const total = faixas.reduce((soma, f) => soma + f.amount, 0);

  return (
    <Bloco
      className="h-full"
      titulo="Antiguidade da dívida"
      subtitulo={
        antiga > 0
          ? `${formatPercent(antiga)} tem mais de 60 dias`
          : "Nenhuma fatura com mais de 60 dias"
      }
      // Total no canto superior direito, alinhado à direita
      acoes={
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
            aria-label={faixas
              .map((f) => `${f.label}: ${formatEuro(f.amount)}`)
              .join(", ")}
          >
            <Pie
              data={fatias}
              dataKey="peso"
              nameKey="label"
              cx="50%"
              cy="100%"
              innerRadius={`${22 * ESCALA}%`}
              outerRadius={raio}
              // Meio-círculo: da esquerda (mais recente) para a direita (mais antiga)
              startAngle={180}
              endAngle={0}
              label={Rotulo}
              labelLine={false}
              stroke="var(--surface)"
              strokeWidth={3}
              cornerRadius={4}
            />
            <Tooltip content={Dica} />
          </PieChart>
        </div>

        <dl className="mt-auto divide-y divide-border">
          {faixas.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-3 py-3 text-[13px]"
            >
              <dt className="flex min-w-0 flex-1 items-center gap-2">
                <i
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: cores[f.key] }}
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
    </Bloco>
  );
}
