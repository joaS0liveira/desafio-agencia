import { formatPercent } from "@/lib/format";
import { Icone, type NomeIcone } from "./Icone";

// normal (verde), aviso (âmbar, ex.: só pendente), perigo (vermelho, ex.: em atraso)
export type TomCartao = "normal" | "aviso" | "perigo";

const tons: Record<
  TomCartao,
  { icone: string; valor: string; grafico: string }
> = {
  normal: {
    icone: "bg-primary-soft text-primary-strong",
    valor: "",
    grafico: "text-accent",
  },
  aviso: {
    icone: "bg-warning-soft text-warning",
    valor: "text-warning",
    grafico: "text-warning",
  },
  perigo: {
    icone: "bg-danger-soft text-danger",
    valor: "text-danger",
    grafico: "text-danger",
  },
};

function Sparkline({ valores, cor }: { valores: number[]; cor: string }) {
  if (valores.length < 2) return null;
  const maximo = Math.max(...valores, 1);
  const pontos = valores
    .map((valor, i) => {
      const x = (i / (valores.length - 1)) * 100;
      const y = 38 - (valor / maximo) * 34;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`h-9 w-20 shrink-0 overflow-visible ${cor}`}
      aria-hidden="true"
    >
      <polyline
        points={pontos}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Variação face ao período anterior: seta para cima a verde, para baixo a vermelho. */
function Variacao({
  valor,
  texto,
  curto,
}: {
  valor: number;
  texto: string;
  /** Texto visível curto (ex.: "vs set"), para não depender do rato */
  curto?: string;
}) {
  const subiu = valor >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${subiu
          ? "bg-primary-soft text-primary-strong"
          : "bg-danger-soft text-danger"
        }`}
      title={texto}
    >
      <Icone nome={subiu ? "subir" : "descer"} tamanho={13} />
      <span className="sr-only">{subiu ? "Subiu" : "Desceu"}</span>
      {formatPercent(Math.abs(valor))}
      {curto && <span className="font-medium opacity-80">{curto}</span>}
    </span>
  );
}

export interface CartaoProps {
  rotulo: string;
  valor: string;
  detalhe?: string;
  icone: NomeIcone;
  tom?: TomCartao;
  variacao?: { valor: number; texto: string; curto?: string } | null;
  serie?: number[];
  compacto?: boolean;
}

/** Cartão de indicador (KPI). */
export function Cartao({
  rotulo,
  valor,
  detalhe,
  icone,
  tom = "normal",
  variacao,
  serie,
  compacto = false,
}: CartaoProps) {
  const cores = tons[tom];
  return (
    <article className="card min-w-0 p-4 sm:p-5">
      <div
        className={`mb-4 items-center justify-between ${compacto ? "hidden sm:flex" : "flex"}`}
      >
        <span
          className={`grid size-9 place-items-center rounded-lg ${cores.icone}`}
        >
          <Icone nome={icone} tamanho={19} />
        </span>
        {variacao && (
          <Variacao
            valor={variacao.valor}
            texto={variacao.texto}
            curto={variacao.curto}
          />
        )}
      </div>
      <span className="block text-xs text-muted">{rotulo}</span>
      <div className="mt-1 flex items-end justify-between gap-3">
        <strong
          className={`truncate text-2xl font-semibold tracking-tight tabular-nums ${cores.valor}`}
        >
          {valor}
        </strong>
        {serie && <Sparkline valores={serie} cor={cores.grafico} />}
      </div>
      {detalhe && <p className="mt-1 text-xs text-muted">{detalhe}</p>}
    </article>
  );
}

export function GrelhaCartoes({
  children,
  colunas = 4,
  compacta = false,
}: {
  children: React.ReactNode;
  colunas?: 3 | 4;
  /** 2 colunas já no telemóvel, para os cartões não empurrarem o conteúdo para baixo */
  compacta?: boolean;
}) {
  return (
    <section
      aria-label="Indicadores"
      className={`grid gap-3 sm:grid-cols-2 ${compacta ? "grid-cols-2" : "grid-cols-1"} ${colunas === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {children}
    </section>
  );
}
