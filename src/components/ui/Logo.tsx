import { useId } from "react";

/** Símbolo da jrl.labs: um frasco de laboratório com circuitos lá dentro. */
export function LogoSimbolo({ tamanho = 32 }: { tamanho?: number }) {
  const gradiente = useId();
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradiente} x1="6" y1="3" x2="26" y2="29">
          <stop offset="0" stopColor="#6fd88b" />
          <stop offset="1" stopColor="#248232" />
        </linearGradient>
      </defs>
      <g
        stroke={`url(#${gradiente})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3h12" />
        <path d="M12.5 3v8.2L5.6 22.6A4 4 0 0 0 9 28.5h3M19.5 3v8.2l6.9 11.4a4 4 0 0 1-3.4 5.9h-3" />
        <path d="M16 28.5V17.4" />
        <path d="M13 28.5v-4.2l-1.6-1.8M19 28.5v-4.2l1.6-1.8" />
      </g>
      <g fill="none" stroke={`url(#${gradiente})`} strokeWidth="1.8">
        <circle cx="16" cy="15.2" r="1.7" />
        <circle cx="10.2" cy="21" r="1.5" />
        <circle cx="21.8" cy="21" r="1.5" />
      </g>
    </svg>
  );
}

/** Logótipo completo: símbolo + "jrl.labs". */
export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoSimbolo />
      {!compacto && (
        <span className="text-[19px] leading-none tracking-tight text-text">
          <span className="font-bold">jrl</span>
          <span className="font-bold text-accent">.</span>
          <span className="font-light">labs</span>
        </span>
      )}
    </span>
  );
}
