import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Bloco } from "@/components/ui/Bloco";
import { Icone } from "@/components/ui/Icone";
import { EtiquetaSetor } from "@/components/ui/IconeSetor";
import { formatEuro, formatPercent } from "@/lib/format";
import type { ClientRevenue } from "@/types/reports";

export function TopClientes({
  clientes,
  pesoTop3,
}: {
  clientes: ClientRevenue[];
  pesoTop3: number;
}) {
  return (
    <Bloco
      titulo="Top clientes"
      subtitulo={`Os 3 maiores pesam ${formatPercent(pesoTop3)} da faturação`}
      acoes={
        <Link href="/clientes" className="btn btn-ghost text-xs">
          Ver todos <Icone nome="seta" tamanho={14} />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Setor</th>
              <th className="!text-right">Faturado</th>
              <th className="w-[30%]">Peso</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(({ client, revenue, share }) => (
              <tr key={client.id}>
                <td>
                  <Link
                    href={`/clientes/${client.id}`}
                    className="flex items-center gap-3 font-medium text-text hover:text-primary-strong"
                  >
                    <Avatar nome={client.company} setor={client.sector} />
                    {client.company}
                  </Link>
                </td>
                <td>
                  <EtiquetaSetor setor={client.sector} />
                </td>
                <td className="text-right font-semibold text-text tabular-nums">
                  {formatEuro(revenue)}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-soft">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${share * 100}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs tabular-nums">
                      {formatPercent(share)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Bloco>
  );
}
