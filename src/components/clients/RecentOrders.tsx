"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatEuro } from "@/lib/format";
import type { Order } from "@/types";

const VISIBLE = 6;

/** Encomendas do cliente, da mais recente para a mais antiga. Mostra 6 e deixa ver todas. */
export function RecentOrders({ orders }: { orders: Order[] }) {
  const [showAll, setShowAll] = useState(false);
  const total = orders.length;
  const fitsAll = total <= VISIBLE;
  const list = showAll || fitsAll ? orders : orders.slice(0, VISIBLE);

  return (
    <Panel
      title="Encomendas"
      subtitle={
        fitsAll || showAll
          ? `Todas as ${total} encomendas, da mais recente para a mais antiga`
          : `As ${VISIBLE} mais recentes de ${total}`
      }
      actions={
        !fitsAll && (
          <button
            type="button"
            className="btn btn-ghost text-xs"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Mostrar menos" : `Ver todas (${total})`}
          </button>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Serviço</th>
              <th className="!text-right">Valor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td className="tabular-nums">{formatDate(e.date)}</td>
                <td className="text-text">{e.service}</td>
                <td className="text-right font-semibold text-text tabular-nums">
                  {formatEuro(e.amount)}
                </td>
                <td>
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
