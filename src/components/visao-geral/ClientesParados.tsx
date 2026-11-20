import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icone } from "@/components/ui/Icone";
import { formatDate } from "@/lib/format";
import type { InactiveClient } from "@/types/reports";

/**
 * Card de alerta com cores fixas da paleta (#2D3A3A → verde #248232, texto #FCFFFC).
 * Como não usa as variáveis do tema, fica igual no modo claro e no escuro
 * e destaca-se dos outros cards brancos/escuros.
 */
export function ClientesParados({ parados }: { parados: InactiveClient[] }) {
  return (
    <section
      className="relative flex min-w-0 flex-col overflow-hidden rounded-xl text-[#fcfffc] shadow-card"
      style={{
        background: "linear-gradient(145deg, #2d3a3a 0%, #248232 100%)",
      }}
    >
      {/* Círculos decorativos no canto */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full border-[28px] border-white/[0.06]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-20 size-40 rounded-full bg-[#2ba84a]/20 blur-2xl"
      />

      <header className="relative flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Icone nome="relogio" tamanho={17} />
            Clientes parados
          </h2>
          <p className="mt-0.5 text-xs text-white/70">
            Sem encomendas há mais de 90 dias
          </p>
        </div>
        {parados.length > 0 && (
          <span className="rounded-full bg-[#fcfffc] px-2.5 py-1 text-xs font-bold text-[#248232]">
            {parados.length}
          </span>
        )}
      </header>

      {parados.length === 0 ? (
        <p className="relative px-5 pt-4 pb-8 text-sm text-white/80">
          Todos os clientes encomendaram nos últimos 90 dias.
        </p>
      ) : (
        <ul className="relative px-3 pb-3">
          {parados.map(({ client, daysSinceLastOrder, lastOrderDate }) => (
            <li key={client.id}>
              <Link
                href={`/clientes/${client.id}`}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/10"
              >
                <span className="rounded-lg ring-2 ring-white/25">
                  <Avatar nome={client.company} setor={client.sector} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {client.company}
                  </span>
                  <span className="block truncate text-xs text-white/65">
                    {lastOrderDate
                      ? `Última: ${formatDate(lastOrderDate)}`
                      : "Sem encomendas"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold tabular-nums">
                  {daysSinceLastOrder} dias
                </span>
                <Icone
                  nome="seta"
                  tamanho={15}
                  className="shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
