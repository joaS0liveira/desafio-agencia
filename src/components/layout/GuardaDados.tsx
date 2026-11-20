"use client";

import type { ReactNode } from "react";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { useAppData } from "@/hooks/useAppData";
import { useStore } from "@/store/useStore";

/**
 * Se os JSON não carregarem, mostra o erro com "Tentar novamente" em vez das páginas.
 * Sem isto, uma falha parecia "nada por cobrar" e "0 €": a pior mentira possível aqui.
 */
export function GuardaDados({ children }: { children: ReactNode }) {
  useAppData(); // garante que o carregamento arranca
  const error = useStore((s) => s.error);
  const loading = useStore((s) => s.loading);
  const loadData = useStore((s) => s.loadData);

  if (!error) return children;

  return (
    <div className="card" role="alert">
      <EstadoVazio
        icone="alerta"
        titulo="Não foi possível carregar os dados"
        texto="Os ficheiros de clientes e encomendas não responderam. Os valores não estão a zero: só não foram lidos. Verifica a ligação e tenta outra vez."
        acao={
          <button
            type="button"
            className="btn btn-primary disabled:opacity-50"
            onClick={() => loadData()}
            disabled={loading}
          >
            {loading ? "A tentar…" : "Tentar novamente"}
          </button>
        }
      />
    </div>
  );
}
