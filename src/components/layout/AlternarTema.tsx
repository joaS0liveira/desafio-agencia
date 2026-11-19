"use client";

import { Icone } from "@/components/ui/Icone";
import { mudarTema, type Tema, useTema } from "@/hooks/useTema";

const opcoes: { valor: Tema; icone: "sol" | "lua"; rotulo: string }[] = [
  { valor: "light", icone: "sol", rotulo: "Modo claro" },
  { valor: "dark", icone: "lua", rotulo: "Modo escuro" },
];

export function AlternarTema() {
  const tema = useTema();

  return (
    <fieldset className="flex h-10 items-center rounded-lg border border-border bg-surface-soft p-[3px]">
      <legend className="sr-only">Tema</legend>
      {opcoes.map((opcao) => {
        const ativo = tema === opcao.valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={ativo}
            aria-label={opcao.rotulo}
            title={opcao.rotulo}
            onClick={() => mudarTema(opcao.valor)}
            className={`grid h-8 w-10 place-items-center rounded-md transition-colors ${
              ativo
                ? "bg-surface text-primary-strong shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <Icone nome={opcao.icone} tamanho={16} />
          </button>
        );
      })}
    </fieldset>
  );
}
