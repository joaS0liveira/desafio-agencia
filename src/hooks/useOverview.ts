"use client";

import { useMemo } from "react";
import { inactiveClients, topClients, topShare } from "@/lib/clients";
import { orderMonths } from "@/lib/dates";
import { filterOrders } from "@/lib/filters";
import { findPeriod, monthsInPeriod, periodGroups } from "@/lib/periods";
import { monthOverMonth, revenueByMonth, revenueByService } from "@/lib/stats";
import { useStore } from "@/store/useStore";
import { ORDER_STATUS } from "@/types";
import { useAppData } from "./useAppData";
import { useFilteredOrders } from "./useFilteredOrders";

/** Tudo o que o ecrã "Visão geral" mostra, calculado a partir das encomendas filtradas. */
export function useOverview() {
  const { clients, orders: allOrders } = useAppData();
  const { orders, totals, loading, isEmpty } = useFilteredOrders();
  const filters = useStore((state) => state.filters);

  return useMemo(() => {
    // Os meses vêm de todas as encomendas, para o eixo não encolher com os filtros
    const months = orderMonths(allOrders);

    // O gráfico e os minigráficos mostram o ano inteiro (com os outros filtros),
    // e o período escolhido aparece em destaque em vez de pôr o resto a zero
    const withoutPeriod = filterOrders(allOrders, clients, {
      ...filters,
      period: null,
    });
    const monthly = revenueByMonth(withoutPeriod, months);
    const highlighted = filters.period
      ? monthsInPeriod(months, filters.period)
      : [];
    const paid = withoutPeriod.filter((o) => o.status === ORDER_STATUS.paid);
    const open = withoutPeriod.filter((o) => o.status !== ORDER_STATUS.paid);

    // Variação do último mês do período (ou do último mês com dados) face ao anterior
    const referenceMonth = highlighted.at(-1) ?? months.at(-1);
    const change = monthOverMonth(monthly).find(
      (m) => m.month === referenceMonth,
    );

    const periods = periodGroups(allOrders);
    const dates = allOrders.map((o) => o.date).sort();

    return {
      loading,
      isEmpty,
      dateRange: dates.length
        ? { from: dates[0], to: dates[dates.length - 1] }
        : null,
      periods,
      selectedPeriod: filters.period
        ? (findPeriod(periods, filters.period) ?? {
            key: "custom",
            label: "Período escolhido",
            value: filters.period,
          })
        : null,
      highlightedMonths: highlighted,
      totals,
      monthly,
      // Faturação média por mês, para a linha de referência do gráfico
      monthlyAverage: monthly.length
        ? monthly.reduce((sum, m) => sum + m.revenue, 0) / monthly.length
        : 0,
      lastMonthChange:
        change?.change != null
          ? { month: change.month, change: change.change }
          : null,
      sparklines: {
        billed: monthly.map((m) => m.revenue),
        received: revenueByMonth(paid, months).map((m) => m.revenue),
        open: revenueByMonth(open, months).map((m) => m.revenue),
      },
      // "Por serviço" compara os serviços entre si: usa todos os filtros menos o de serviço,
      // que em vez de esconder os outros serviços passa a destacar o escolhido
      services: revenueByService(
        filterOrders(allOrders, clients, { ...filters, service: null }),
      ),
      selectedService: filters.service,
      topClients: topClients(orders, clients, 5),
      top3Share: topShare(orders, clients, 3),
      // "Parados" olha sempre para todas as encomendas: não depende dos filtros
      inactive: inactiveClients(clients, allOrders, 90),
    };
  }, [orders, totals, loading, isEmpty, clients, allOrders, filters]);
}
