import { Icon } from "@/components/ui/Icon";

/** Botões de página: ← Anterior · 1 2 3 · Seguinte → */
export function Pagination({
  page,
  totalPages,
  onChange,
  summary,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Texto à esquerda, por exemplo "A mostrar 1–9 de 14 clientes" */
  summary?: string;
}) {
  if (totalPages <= 1 && !summary) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base =
    "grid h-9 min-w-9 place-items-center rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors";

  return (
    <nav
      aria-label="Páginas"
      className="mt-6 flex flex-wrap items-center justify-between gap-3"
    >
      {summary && <p className="text-sm text-muted">{summary}</p>}

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn btn-secondary h-9 px-3 disabled:pointer-events-none disabled:opacity-40"
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            <Icon name="arrowLeft" size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {pages.map((n) => {
            const current = n === page;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-current={current ? "page" : undefined}
                aria-label={`Página ${n}`}
                className={`${base} ${
                  current
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
            onClick={() => onChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Página seguinte"
          >
            <span className="hidden sm:inline">Seguinte</span>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
