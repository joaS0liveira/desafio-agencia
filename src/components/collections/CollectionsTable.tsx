import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { collectionEmailLink } from "@/lib/actions";
import { formatDate, formatEuro } from "@/lib/format";
import type { CollectionRow } from "@/types/reports";

export function CollectionsTable({ lines }: { lines: CollectionRow[] }) {
  const total = lines.reduce((sum, l) => sum + l.order.amount, 0);
  return (
    <div className="relative overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Emitida em</th>
            <th className="!text-right">Há</th>
            <th className="!text-right">Valor</th>
            <th>Estado</th>
            <th>
              <span className="sr-only">Ação</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map(({ order, client, daysOutstanding }) => (
            <tr key={order.id}>
              <td>
                {client ? (
                  <Link
                    href={`/clientes/${client.id}`}
                    className="flex items-center gap-3 font-medium text-text hover:text-primary-strong"
                  >
                    <Avatar name={client.company} sector={client.sector} />
                    {client.company}
                  </Link>
                ) : (
                  "Cliente desconhecido"
                )}
              </td>
              <td>{order.service}</td>
              <td className="tabular-nums">{formatDate(order.date)}</td>
              <td
                className={`text-right tabular-nums ${daysOutstanding > 60 ? "font-semibold text-danger" : ""}`}
              >
                {/* Mais de 60 dias: ícone e texto, não só a cor */}
                {daysOutstanding > 60 && (
                  <>
                    <Icon
                      name="alert"
                      size={13}
                      className="mr-1 inline align-[-2px]"
                    />
                    <span className="sr-only">Antiga: </span>
                  </>
                )}
                {daysOutstanding} dias
              </td>
              <td className="text-right font-semibold text-text tabular-nums">
                {formatEuro(order.amount)}
              </td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td className="text-right">
                {client && (
                  <a
                    href={collectionEmailLink(client, order)}
                    className="btn btn-secondary h-8 text-xs"
                  >
                    <Icon name="email" size={15} />
                    Enviar email
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-surface-soft text-sm">
            <td className="!text-text font-semibold" colSpan={4}>
              Total · {lines.length} {lines.length === 1 ? "fatura" : "faturas"}
            </td>
            <td className="text-right !text-text font-semibold tabular-nums">
              {formatEuro(total)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
