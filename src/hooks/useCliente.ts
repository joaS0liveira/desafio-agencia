import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { unique } from "@/lib/filters";
import { clientSummary, missingServices, opportunityMessage } from "@/lib/clients";
import { buildMailto, buildTel } from "@/lib/contacts";
import { earliestDate, latestDate, monthRange } from "@/lib/dates";
import { revenueByMonth, revenueByService } from "@/lib/stats";

/** Tudo sobre um cliente (/clientes/[id]). Ignora os filtros: mostra sempre o cliente inteiro. */
export function useCliente(id: number | string, limiteRecentes = 6) {
  const encomendas = useAppStore((s) => s.orders);
  const clientes = useAppStore((s) => s.clients);

  return useMemo(() => {
    const clienteId = Number(id);
    const cliente = clientes.find((c) => c.id === clienteId) ?? null;
    if (!cliente) {
      return { naoEncontrado: true as const, cliente: null };
    }

    // Referência das contagens de dias: a última encomenda, não a data de hoje.
    const primeira = earliestDate(encomendas);
    const ultima = latestDate(encomendas);
    const meses = primeira && ultima ? monthRange(primeira, ultima) : [];

    const dele = encomendas.filter((o) => o.client_id === clienteId);
    const faltam = missingServices(encomendas, clienteId, unique(encomendas.map((o) => o.service)));

    return {
      naoEncontrado: false as const,
      cliente,
      resumo: clientSummary(cliente, encomendas, ultima ?? ""),
      mensal: revenueByMonth(dele, meses),
      servicos: revenueByService(dele),
      servicosEmFalta: faltam,
      oportunidade: opportunityMessage(dele.map((o) => o.service), faltam),
      encomendasRecentes: [...dele]
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .slice(0, limiteRecentes),
      emailHref: buildMailto(cliente.email),
      telHref: buildTel(cliente.phone),
    };
  }, [id, encomendas, clientes, limiteRecentes]);
}
