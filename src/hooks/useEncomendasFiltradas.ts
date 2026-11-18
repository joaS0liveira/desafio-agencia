import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { filterOrders } from "@/lib/filters";
import { totals } from "@/lib/stats";

/** Encomendas depois de aplicados os filtros partilhados (pesquisa, período, serviço, estado, setor). */
export function useEncomendasFiltradas() {
  const encomendas = useAppStore((s) => s.orders);
  const clientes = useAppStore((s) => s.clients);
  const filtros = useAppStore((s) => s.filters);

  return useMemo(() => {
    const filtradas = filterOrders(encomendas, clientes, filtros);
    return {
      encomendas: filtradas,
      totais: totals(filtradas), // faturado, recebido, em aberto, em atraso, pendente, ticket médio...
      total: filtradas.length,
      vazio: filtradas.length === 0,
    };
  }, [encomendas, clientes, filtros]);
}