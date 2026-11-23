import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { SectorLabel } from "@/components/ui/SectorIcon";
import { openTone } from "@/lib/debtors";
import { formatDate, formatEuro } from "@/lib/format";
import type { Client } from "@/types";
import type { ClientSummary } from "@/types/reports";

const STALE_DAYS = 90;

// Regra única de "Em aberto": vermelho se há atraso, âmbar se só pendente
const openColor = {
  danger: "text-danger",
  warning: "text-warning",
  normal: "text-muted",
} as const;

function Metric({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone?: string;
  /** Linha pequena por baixo do valor (ex.: "56 k€ em atraso") */
  note?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={`mt-0.5 truncate text-sm font-semibold tabular-nums ${tone ?? ""}`}
      >
        {value}
      </dd>
      {note && (
        <dd
          className={`truncate text-[11px] font-medium tabular-nums ${tone ?? ""}`}
        >
          {note}
        </dd>
      )}
    </div>
  );
}

/** Grelha de cartões, um por cliente. Cada cartão abre o detalhe. */
export function ClientGrid({
  clientList,
}: {
  clientList: {
    client: Client;
    summary: ClientSummary;
    debt: { overdue: number; pending: number };
  }[];
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {clientList.map(({ client, summary, debt }) => {
        const inactive = (summary.daysSinceLastOrder ?? 0) > STALE_DAYS;
        return (
          <li key={client.id}>
            <Link
              href={`/clientes/${client.id}`}
              aria-label={`${client.company}, ${client.sector}, ${client.city}. Ver detalhe`}
              className="card group flex h-full flex-col p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-card-hover"
            >
              <div className="flex items-start gap-3">
                <Avatar name={client.company} sector={client.sector} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold group-hover:text-primary-strong">
                    {client.company}
                  </p>
                  <p className="flex min-w-0 items-center gap-1 text-xs text-muted">
                    <SectorLabel sector={client.sector} />
                    <span className="truncate">
                      · {client.city} · {client.contact_name}
                    </span>
                  </p>
                </div>
                <Icon
                  name="arrowRight"
                  size={16}
                  className="mt-1 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
                <Metric label="Faturado" value={formatEuro(summary.billed)} />
                <Metric
                  label="Em aberto"
                  value={summary.open ? formatEuro(summary.open) : "—"}
                  tone={openColor[openTone(debt.overdue, debt.pending)]}
                  note={
                    debt.overdue > 0
                      ? `${formatEuro(debt.overdue)} em atraso`
                      : debt.pending > 0
                        ? "pendente"
                        : undefined
                  }
                />
                <Metric
                  label="Última"
                  value={
                    summary.lastOrderDate
                      ? formatDate(summary.lastOrderDate)
                      : "—"
                  }
                />
              </dl>

              {inactive && (
                <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                  <Icon name="clock" size={13} />
                  Parado há {summary.daysSinceLastOrder} dias
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
