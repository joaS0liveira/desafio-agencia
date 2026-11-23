"use client";

import type { ReactNode } from "react";
import { EmptyState, LoadingBars } from "@/components/ui/EmptyState";
import { useAppData } from "@/hooks/useAppData";
import { useStore } from "@/store/useStore";

/**
 * Se os JSON não carregarem, mostra o erro com "Tentar novamente" em vez das páginas.
 * Sem isto, uma falha parecia "nada por cobrar" e "0 €": a pior mentira possível aqui.
 */
export function DataGuard({ children }: { children: ReactNode }) {
  useAppData(); // garante que o carregamento arranca
  const error = useStore((s) => s.error);
  const loading = useStore((s) => s.loading);
  const loadData = useStore((s) => s.loadData);

  if (!error) return children;

  return (
    <div className="card" role="alert">
      <EmptyState
        icon="alert"
        title="Não foi possível carregar os dados"
        text="Os ficheiros de clientes e encomendas não responderam. Os valores não estão a zero: só não foram lidos. Verifica a ligação e tenta outra vez."
        action={
          <button
            type="button"
            className="btn btn-primary disabled:opacity-50"
            onClick={() => loadData()}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingBars className="h-3.5 [&>i]:bg-current" /> A tentar…
              </>
            ) : (
              "Tentar novamente"
            )}
          </button>
        }
      />
    </div>
  );
}
