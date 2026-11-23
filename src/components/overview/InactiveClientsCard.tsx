import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import type { InactiveClient } from "@/types/reports";

/**
 * Card de alerta: o mesmo fundo dos outros cartões, com uma borda laranja
 * para se destacar. Usa as cores do tema, por isso funciona no modo claro e no escuro.
 */
export function InactiveClientsCard({
  inactiveClients,
}: {
  inactiveClients: InactiveClient[];
}) {
  return (
    <section className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border-[3px] border-accent bg-surface shadow-card">
      {/* Círculo decorativo no canto */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full border-[28px] border-accent/[0.07]"
      />

      <header className="relative flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="clock" size={17} className="text-brand" />
            Clientes parados
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Sem encomendas há mais de 90 dias
          </p>
        </div>
        {inactiveClients.length > 0 && (
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-on-primary">
            {inactiveClients.length}
          </span>
        )}
      </header>

      {inactiveClients.length === 0 ? (
        <p className="relative px-5 pt-4 pb-8 text-sm text-muted">
          Todos os clientes encomendaram nos últimos 90 dias.
        </p>
      ) : (
        <ul className="relative px-3 pb-3">
          {inactiveClients.map(
            ({ client, daysSinceLastOrder, lastOrderDate }) => (
              <li key={client.id}>
                <Link
                  href={`/clientes/${client.id}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-hover"
                >
                  <Avatar name={client.company} sector={client.sector} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium group-hover:text-primary-strong">
                      {client.company}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {lastOrderDate
                        ? `Última: ${formatDate(lastOrderDate)}`
                        : "Sem encomendas"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface-soft px-2.5 py-1 text-xs font-semibold tabular-nums">
                    {daysSinceLastOrder} dias
                  </span>
                  <Icon
                    name="arrowRight"
                    size={15}
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                  />
                </Link>
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}
