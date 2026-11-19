import type { ReactNode } from "react";

export type NomeIcone =
  | "inicio"
  | "cobrancas"
  | "clientes"
  | "sol"
  | "lua"
  | "seta"
  | "voltar"
  | "email"
  | "telefone"
  | "descarregar"
  | "pesquisa"
  | "faturado"
  | "recebido"
  | "aberto"
  | "ticket"
  | "alerta"
  | "relogio"
  | "subir"
  | "descer";

const caminhos: Record<NomeIcone, ReactNode> = {
  inicio: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
    </>
  ),
  cobrancas: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  clientes: (
    <>
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </>
  ),
  lua: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  voltar: <path d="M19 12H5M11 18l-6-6 6-6" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  telefone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
  ),
  descarregar: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  pesquisa: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  faturado: (
    <>
      <path d="m4 15 5-5 4 4 7-8" />
      <path d="M15 6h5v5" />
    </>
  ),
  recebido: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  aberto: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9a3 3 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v3Z" />
      <path d="M14 5v14" strokeDasharray="2 2" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  subir: <path d="M12 19V5M5 12l7-7 7 7" />,
  descer: <path d="M12 5v14M19 12l-7 7-7-7" />,
};

export function Icone({
  nome,
  tamanho = 20,
  className,
}: {
  nome: NomeIcone;
  tamanho?: number;
  className?: string;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {caminhos[nome]}
    </svg>
  );
}
