import { Avatar } from "@/components/ui/Avatar";
import { Icone } from "@/components/ui/Icone";
import { EtiquetaSetor } from "@/components/ui/IconeSetor";
import { formatDate } from "@/lib/format";
import type { Client } from "@/types";

export function CabecalhoCliente({
  cliente,
  emailHref,
  phoneHref,
}: {
  cliente: Client;
  emailHref: string;
  phoneHref: string;
}) {
  return (
    <section className="card mb-3 flex flex-wrap items-center gap-4 p-5">
      <Avatar nome={cliente.company} setor={cliente.sector} tamanho="lg" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1 text-sm text-muted">
          <EtiquetaSetor setor={cliente.sector} />
          <span>
            · {cliente.city} · {cliente.contact_name}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted">
          <a href={emailHref} className="text-text hover:text-primary-strong">
            {cliente.email}
          </a>{" "}
          · <span className="tabular-nums">{cliente.phone}</span> · cliente
          desde {formatDate(cliente.customer_since)}
        </p>
      </div>
      <div className="flex gap-2">
        <a href={emailHref} className="btn btn-primary">
          <Icone nome="email" tamanho={17} />
          Enviar email
        </a>
        <a href={phoneHref} className="btn btn-secondary">
          <Icone nome="telefone" tamanho={16} />
          Ligar
        </a>
      </div>
    </section>
  );
}
