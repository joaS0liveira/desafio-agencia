import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ALL, hasActiveFilters, unique } from "@/lib/filters";
import { earliestDate, latestDate, monthLabel, monthRange } from "@/lib/dates";
import type { OrderStatus } from "@/types";

const ESTADOS: OrderStatus[] = ["Paga", "Pendente", "Em atraso"];

/** Filtros partilhados entre páginas (vivem na store, por isso mantêm-se ao navegar). */
export function useFiltros() {
  const filtros = useAppStore((s) => s.filters);
  const definirFiltro = useAppStore((s) => s.setFilter);
  const limparFiltros = useAppStore((s) => s.resetFilters);
  const encomendas = useAppStore((s) => s.orders);
  const clientes = useAppStore((s) => s.clients);

  const opcoes = useMemo(() => {
    const primeira = earliestDate(encomendas);
    const ultima = latestDate(encomendas);
    const meses = primeira && ultima ? monthRange(primeira, ultima) : [];
    return {
      periodos: [
        { value: ALL as string, label: "Todo o período" },
        ...meses.map((m) => ({ value: m, label: monthLabel(m) })),
      ],
      servicos: unique(encomendas.map((o) => o.service)),
      setores: unique(clientes.map((c) => c.sector)),
      estados: ESTADOS,
    };
  }, [encomendas, clientes]);

  return {
    filtros, // { search, period, service, status, sector }
    definirFiltro, // definirFiltro("service", "Consultoria")
    limparFiltros, // botão "Limpar filtros"
    temFiltrosAtivos: hasActiveFilters(filtros),
    opcoes,
  };
}
