import type { ReactNode } from "react";

// Painel: título, subtítulo opcional e ações à direita

export function Bloco({
  titulo,
  subtitulo,
  acoes,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
  children: ReactNode;
  className?: string;
}) {

  return (
    <section className={`card flex min-w-0 flex-col overflow-hidden
      ${className}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{titulo}</h2>
          {subtitulo && (
            <p className="mt-0.5 text-xs text-muted">{subtitulo}</p>
          )}
        </div>
        {acoes && (
          <div className="ml-auto flex max-w-full flex-wrap items-center gap-2">
            {acoes}
          </div>
        )}
      </header>
      {children}
    </section>
  );
}

// Título da página: título, descrição e ações

export function CabecalhoPagina({
  titulo,
  descricao,
  acoes,
}: {
  titulo: string;
  descricao?: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
          {titulo}
        </h1>
        {descricao && <p className="mt-1 text-sm text-muted">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </section>
  );
}
