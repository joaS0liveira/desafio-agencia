import { useId } from "react";

// Barras do símbolo, da mais baixa à mais alta (x, topo); todas assentam em y = 28.
const BARS = [
  [2, 21],
  [10, 17.5],
  [18, 13.5],
  [26, 9],
] as const;
const CURVE = "M1 19.6C10 18.5 20 14 30.5 5.2";

/**
 * Símbolo da jrl.fin: um gráfico de barras a subir com uma seta por cima.
 * A curva "corta" o topo das barras (máscara), como no logótipo original,
 * e a folga mostra o fundo, por isso funciona no modo claro e no escuro.
 * Dentro do ecrã de entrada, as classes logo-* animam as barras e a seta.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  const id = useId();
  const gradient = `${id}-g`;
  const mask = `${id}-m`;
  return (
    <svg
      width={size * (36 / 30)}
      height={size}
      viewBox="0 0 36 30"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="0"
          y1="30"
          x2="36"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#c2410c" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse">
          <rect width="36" height="30" fill="#fff" />
          <path d={CURVE} stroke="#000" strokeWidth="5" strokeLinecap="round" />
        </mask>
      </defs>
      <g mask={`url(#${mask})`} fill={`url(#${gradient})`}>
        {BARS.map(([x, top], i) => (
          <rect
            key={x}
            className="logo-bar"
            style={{ "--i": i } as React.CSSProperties}
            x={x}
            y={top}
            width="6"
            height={28 - top}
            rx="0.8"
          />
        ))}
      </g>
      <path
        className="logo-curve"
        d={CURVE}
        stroke={`url(#${gradient})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        className="logo-arrow"
        d="M34.1 2.2 32.05 7.8 28.2 3.2Z"
        fill={`url(#${gradient})`}
        stroke={`url(#${gradient})`}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "jrl.fin": jrl a negrito, ponto laranja, fin em regular. Herda a cor do texto. */
export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-logo leading-none tracking-[-0.035em] whitespace-nowrap ${className}`}
    >
      <span className="font-bold">jrl</span>
      <span className="font-bold text-accent">.</span>
      <span className="font-normal">fin</span>
    </span>
  );
}

/** Assinatura "Produto da jrl.labs"; com `linhas`, leva um traço de cada lado (como no logótipo). */
export function LogoSignature({
  lines = false,
  className = "",
}: {
  lines?: boolean;
  className?: string;
}) {
  const tick = (
    <i aria-hidden="true" className="h-px w-10 shrink-0 bg-border-strong" />
  );
  return (
    <span
      className={`flex items-center gap-3 font-logo whitespace-nowrap text-muted ${className}`}
    >
      {lines && tick}
      <span>
        Produto da{" "}
        <span className="text-text">
          <span className="font-bold">jrl</span>
          <span className="font-bold text-accent">.</span>
          <span className="font-light">labs</span>
        </span>
      </span>
      {lines && tick}
    </span>
  );
}

/** Logótipo completo: símbolo + "jrl.fin" e, opcionalmente, a assinatura por baixo. */
export function Logo({
  compact = false,
  signature = false,
}: {
  compact?: boolean;
  signature?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <span className="flex flex-col gap-1.5">
          <LogoWordmark className="text-[23px] text-text" />
          {signature && <LogoSignature className="text-[10.5px]" />}
        </span>
      )}
    </span>
  );
}
