import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icone } from "@/components/ui/Icone";
import { EtiquetaSetor } from "@/components/ui/IconeSetor";
import { openTone } from "@/lib/debtors";
import { formatDate, formatEuro } from "@/lib/format";
import type { Client } from "@/types";
import type { ClientSummary } from "@/types/reports";

const DIAS_PARADO = 90;

// Regra única de "Em aberto": vermelho se há atraso, âmbar se só pendente
const corAberto = {
  perigo: "text-danger",
  aviso: "text-warning",
  normal: "text-muted",
} as const;

function Dado({
  rotulo,
  valor,
  tom,
  nota,
}: {
  rotulo: string;
  valor: string;
  tom?: string;
  /** Linha pequena por baixo do valor (ex.: "56 k€ em atraso") */
  nota?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{rotulo}</dt>
      <dd
        className={`mt-0.5 truncate text-sm font-semibold tabular-nums ${tom ?? ""}`}
      >
        {valor}
      </dd>
      {nota && (
        <dd
          className={`truncate text-[11px] font-medium tabular-nums ${tom ?? ""}`}
        >
          {nota}
        </dd>
      )}
    </div>
  );
}

/** Grelha de cartões, um por cliente. Cada cartão abre o detalhe. */
export function TabelaClientes({
  clientes,
}: {
  clientes: {
    client: Client;
    summary: ClientSummary;
    debt: { overdue: number; pending: number };
  }[];
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {clientes.map(({ client, summary, debt }) => {
        const parado = (summary.daysSinceLastOrder ?? 0) > DIAS_PARADO;
        return (
          <li key={client.id}>
            <Link
              href={`/clientes/${client.id}`}
              aria-label={`${client.company}, ${client.sector}, ${client.city}. Ver detalhe`}
              className="card group flex h-full flex-col p-5 transition-colors hover:border-primary"
            >
              <div className="flex items-start gap-3">
                <Avatar nome={client.company} setor={client.sector} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold group-hover:text-primary-strong">
                    {client.company}
                  </p>
                  <p className="flex min-w-0 items-center gap-1 text-xs text-muted">
                    <EtiquetaSetor setor={client.sector} />
                    <span className="truncate">
                      · {client.city} · {client.contact_name}
                    </span>
                  </p>
                </div>
                <Icone
                  nome="seta"
                  tamanho={16}
                  className="mt-1 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
                <Dado rotulo="Faturado" valor={formatEuro(summary.billed)} />
                <Dado
                  rotulo="Em aberto"
                  valor={summary.open ? formatEuro(summary.open) : "—"}
                  tom={corAberto[openTone(debt.overdue, debt.pending)]}
                  nota={
                    debt.overdue > 0
                      ? `${formatEuro(debt.overdue)} em atraso`
                      : debt.pending > 0
                        ? "pendente"
                        : undefined
                  }
                />
                <Dado
                  rotulo="Última"
                  valor={
                    summary.lastOrderDate
                      ? formatDate(summary.lastOrderDate)
                      : "—"
                  }
                />
              </dl>

              {parado && (
                <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                  <Icone nome="relogio" tamanho={13} />
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
