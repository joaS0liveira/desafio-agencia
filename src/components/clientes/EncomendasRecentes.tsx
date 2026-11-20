"use client";

import { useState } from "react";
import { Bloco } from "@/components/ui/Bloco";
import { EtiquetaEstado } from "@/components/ui/EtiquetaEstado";
import { formatDate, formatEuro } from "@/lib/format";
import type { Order } from "@/types";

const VISIVEIS = 6;

/** Encomendas do cliente, da mais recente para a mais antiga. Mostra 6 e deixa ver todas. */
export function EncomendasRecentes({ encomendas }: { encomendas: Order[] }) {
  const [todas, setTodas] = useState(false);
  const total = encomendas.length;
  const cabeTudo = total <= VISIVEIS;
  const lista = todas || cabeTudo ? encomendas : encomendas.slice(0, VISIVEIS);

  return (
    <Bloco
      titulo="Encomendas"
      subtitulo={
        cabeTudo || todas
          ? `Todas as ${total} encomendas, da mais recente para a mais antiga`
          : `As ${VISIVEIS} mais recentes de ${total}`
      }
      acoes={
        !cabeTudo && (
          <button
            type="button"
            className="btn btn-ghost text-xs"
            aria-expanded={todas}
            onClick={() => setTodas((v) => !v)}
          >
            {todas ? "Mostrar menos" : `Ver todas (${total})`}
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
            {lista.map((e) => (
              <tr key={e.id}>
                <td className="tabular-nums">{formatDate(e.date)}</td>
                <td className="text-text">{e.service}</td>
                <td className="text-right font-semibold text-text tabular-nums">
                  {formatEuro(e.amount)}
                </td>
                <td>
                  <EtiquetaEstado estado={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Bloco>
  );
}
