import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { EtiquetaEstado } from "@/components/ui/EtiquetaEstado";
import { Icone } from "@/components/ui/Icone";
import { collectionEmailLink } from "@/lib/actions";
import { formatDate, formatEuro } from "@/lib/format";
import type { CollectionRow } from "@/types/reports";

export function TabelaCobrancas({ linhas }: { linhas: CollectionRow[] }) {
  const total = linhas.reduce((soma, l) => soma + l.order.amount, 0);
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
          {linhas.map(({ order, client, daysOutstanding }) => (
            <tr key={order.id}>
              <td>
                {client ? (
                  <Link
                    href={`/clientes/${client.id}`}
                    className="flex items-center gap-3 font-medium text-text hover:text-primary-strong"
                  >
                    <Avatar nome={client.company} setor={client.sector} />
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
                    <Icone
                      nome="alerta"
                      tamanho={13}
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
                <EtiquetaEstado estado={order.status} />
              </td>
              <td className="text-right">
                {client && (
                  <a
                    href={collectionEmailLink(client, order)}
                    className="btn btn-secondary h-8 text-xs"
                  >
                    <Icone nome="email" tamanho={15} />
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
              Total · {linhas.length}{" "}
              {linhas.length === 1 ? "fatura" : "faturas"}
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
