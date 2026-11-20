import { Icone } from "./Icone";

/** Botões de página: ← Anterior · 1 2 3 · Seguinte → */
export function Paginacao({
  pagina,
  totalPaginas,
  aoMudar,
  resumo,
}: {
  pagina: number;
  totalPaginas: number;
  aoMudar: (pagina: number) => void;
  /** Texto à esquerda, por exemplo "A mostrar 1–9 de 14 clientes" */
  resumo?: string;
}) {
  if (totalPaginas <= 1 && !resumo) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const base =
    "grid h-9 min-w-9 place-items-center rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors";

  return (
    <nav
      aria-label="Páginas"
      className="mt-6 flex flex-wrap items-center justify-between gap-3"
    >
      {resumo && <p className="text-sm text-muted">{resumo}</p>}

      {totalPaginas > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn btn-secondary h-9 px-3 disabled:pointer-events-none disabled:opacity-40"
            onClick={() => aoMudar(pagina - 1)}
            disabled={pagina === 1}
            aria-label="Página anterior"
          >
            <Icone nome="voltar" tamanho={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {paginas.map((n) => {
            const atual = n === pagina;
            return (
              <button
                key={n}
                type="button"
                onClick={() => aoMudar(n)}
                aria-current={atual ? "page" : undefined}
                aria-label={`Página ${n}`}
                className={`${base} ${
                  atual
                    ? "bg-primary text-on-primary"
                    : "border border-border bg-surface text-text hover:border-primary hover:text-primary-strong"
                }`}
              >
                {n}
              </button>
            );
          })}

          <button
            type="button"
            className="btn btn-secondary h-9 px-3 disabled:pointer-events-none disabled:opacity-40"
            onClick={() => aoMudar(pagina + 1)}
            disabled={pagina === totalPaginas}
            aria-label="Página seguinte"
          >
            <span className="hidden sm:inline">Seguinte</span>
            <Icone nome="seta" tamanho={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
