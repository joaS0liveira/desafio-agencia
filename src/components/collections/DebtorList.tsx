import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { phoneLink } from "@/lib/actions";
import { type Debtor, debtorEmailLink } from "@/lib/debtors";
import { formatEuro } from "@/lib/format";

/**
 * A lista de contactos de Cobranças: um cliente por linha, por ordem de quem
 * contactar primeiro (mais em atraso), com as duas ações à mão: Email e Ligar.
 */
export function DebtorList({ debtors }: { debtors: Debtor[] }) {
  return (
    <Panel
      title="A contactar"
      subtitle="Quem tem mais em atraso aparece primeiro. O email junta todas as faturas do cliente."
    >
      <ul className="divide-y divide-border px-5 pb-2">
        {debtors.map((d) => {
          const invoices = d.rows.length;
          return (
            <li
              key={d.client.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3.5"
            >
              <Link
                href={`/clientes/${d.client.id}`}
                className="group flex min-w-0 flex-1 basis-52 items-center gap-3"
              >
                <Avatar name={d.client.company} sector={d.client.sector} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium group-hover:text-primary-strong">
                    {d.client.company}
                  </span>
                  <span className="block text-xs text-muted">
                    {d.client.contact_name} · {invoices}{" "}
                    {invoices === 1 ? "fatura" : "faturas"} · há {d.oldestDays}{" "}
                    dias
                  </span>
                </span>
              </Link>

              <span className="ml-auto text-right">
                <strong className="block text-sm font-semibold tabular-nums">
                  {formatEuro(d.total)}
                </strong>
                <span
                  className={`block text-xs tabular-nums ${d.overdue ? "font-medium text-danger" : "text-muted"}`}
                >
                  {d.overdue
                    ? `${formatEuro(d.overdue)} em atraso`
                    : "só pendente"}
                </span>
              </span>

              <span className="flex gap-2">
                <a
                  href={debtorEmailLink(d)}
                  className="btn btn-primary h-9 px-3 text-xs"
                  aria-label={`Enviar email a ${d.client.company} com as ${invoices} faturas`}
                >
                  <Icon name="email" size={15} />
                  Email
                </a>
                <a
                  href={phoneLink(d.client.phone)}
                  className="btn btn-secondary h-9 px-3 text-xs"
                  aria-label={`Ligar a ${d.client.contact_name}, ${d.client.company}, ${d.client.phone}`}
                >
                  <Icon name="phone" size={14} />
                  Ligar
                </a>
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
