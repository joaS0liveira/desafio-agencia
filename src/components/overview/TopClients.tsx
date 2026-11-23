import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { SectorLabel } from "@/components/ui/SectorIcon";
import { formatEuro, formatPercent } from "@/lib/format";
import type { ClientRevenue } from "@/types/reports";

export function TopClients({
  clientList,
  top3Weight,
}: {
  clientList: ClientRevenue[];
  top3Weight: number;
}) {
  return (
    <Panel
      title="Top clientes"
      subtitle={`Os 3 maiores pesam ${formatPercent(top3Weight)} da faturação`}
      actions={
        <Link href="/clientes" className="btn btn-ghost text-xs">
          Ver todos <Icon name="arrowRight" size={14} />
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
            {clientList.map(({ client, revenue, share }) => (
              <tr key={client.id}>
                <td>
                  <Link
                    href={`/clientes/${client.id}`}
                    className="flex items-center gap-3 font-medium text-text hover:text-primary-strong"
                  >
                    <Avatar name={client.company} sector={client.sector} />
                    {client.company}
                  </Link>
                </td>
                <td>
                  <SectorLabel sector={client.sector} />
                </td>
                <td className="text-right font-semibold text-text tabular-nums">
                  {formatEuro(revenue)}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-soft">
                      <div
                        className="h-full rounded-full bg-brand"
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
    </Panel>
  );
}
