import type { ReactNode } from "react";
import { Icone, type NomeIcone } from "./Icone";

/** Mensagem quando não há nada para mostrar (sem resultados, cliente inexistente…). */
export function EstadoVazio({
  titulo,
  texto,
  icone = "pesquisa",
  acao,
}: {
  titulo: string;
  texto?: string;
  icone?: NomeIcone;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-surface-soft text-muted">
        <Icone nome={icone} />
      </span>
      <p className="mt-3 text-sm font-semibold">{titulo}</p>
      {texto && <p className="mt-1 max-w-sm text-sm text-muted">{texto}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}


export function ACarregar() {
  return (
    <output
      aria-busy="true"
      aria-label="A carregar dados"
      className="block space-y-6"
    >
      <div className="h-16 w-72 animate-pulse rounded-lg bg-surface-soft" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="card h-32 animate-pulse" />
        ))}
      </div>
      <div className="card h-80 animate-pulse" />
    </output>
  );
}
