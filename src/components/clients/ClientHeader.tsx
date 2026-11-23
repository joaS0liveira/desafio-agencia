import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { SectorLabel } from "@/components/ui/SectorIcon";
import { formatDate } from "@/lib/format";
import type { Client } from "@/types";

export function ClientHeader({
  client,
  emailHref,
  phoneHref,
}: {
  client: Client;
  emailHref: string;
  phoneHref: string;
}) {
  return (
    // Telemóvel: avatar + dados em cima, botões numa linha própria a toda a largura.
    // A partir de sm: tudo na mesma linha, com os botões à direita.
    <section className="card mb-3 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:items-center sm:gap-4">
        <Avatar name={client.company} sector={client.sector} size="lg" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-muted">
            <SectorLabel sector={client.sector} />
            <span aria-hidden="true">·</span>
            <span>{client.city}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{client.contact_name}</span>
          </p>
          <p className="mt-1">
            <a
              href={emailHref}
              className="break-all text-text hover:text-primary-strong"
            >
              {client.email}
            </a>
          </p>
          <p className="mt-0.5 flex flex-wrap gap-x-1.5 text-muted">
            <span className="whitespace-nowrap tabular-nums">
              {client.phone}
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">
              cliente desde {formatDate(client.customer_since)}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
        <a href={emailHref} className="btn btn-primary">
          <Icon name="email" size={17} />
          Enviar email
        </a>
        <a href={phoneHref} className="btn btn-secondary">
          <Icon name="phone" size={16} />
          Ligar
        </a>
      </div>
    </section>
  );
}
