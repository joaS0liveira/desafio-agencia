"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Logo, LogoSimbolo } from "@/components/ui/Logo";
import { useAppData } from "@/hooks/useAppData";
import { phoneLink } from "@/lib/actions";
import { collectionRows } from "@/lib/collections";
import { debtorEmailLink, debtorsByClient } from "@/lib/debtors";
import { formatEuro } from "@/lib/format";
import { useStore } from "@/store/useStore";

const navegacao: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: "/", rotulo: "Visão geral", icone: "inicio" },
  { href: "/cobrancas", rotulo: "Cobranças", icone: "cobrancas" },
  { href: "/clientes", rotulo: "Clientes", icone: "clientes" },
];

function estaAtivo(caminho: string, href: string) {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

/**
 * Cartão no fundo da barra: a fila de quem contactar (a mesma ordem de Cobranças:
 * mais em atraso primeiro). Mostra um cliente de cada vez, com Email e Ligar à mão,
 * e deixa avançar na fila sem sair da página.
 */
function CartaoContactar() {
  const { clients, orders, loading } = useAppData();
  const error = useStore((s) => s.error);
  const devedores = useMemo(
    () => debtorsByClient(collectionRows(orders, clients)),
    [orders, clients],
  );
  const [posicao, setPosicao] = useState(0);
  if (loading || error) return null;

  const cabecalho = (extra?: React.ReactNode) => (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
        <Icone nome="telefone" tamanho={13} className="text-primary-strong" />A
        contactar
      </h2>
      {extra}
    </div>
  );

  if (!devedores.length) {
    return (
      <div className="rounded-xl border border-border bg-surface-soft p-4">
        {cabecalho()}
        <p className="mt-2 text-xs text-muted">
          Ninguém deve nada. Bom trabalho!
        </p>
      </div>
    );
  }

  const total = devedores.length;
  const i = posicao % total;
  const atual = devedores[i];
  const { client, overdue, oldestDays, rows } = atual;
  const mudar = (passo: number) => setPosicao((i + passo + total) % total);
  const seta =
    "grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text";

  return (
    <div className="rounded-xl border border-border bg-surface-soft p-4">
      {cabecalho(
        total > 1 && (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className={seta}
              onClick={() => mudar(-1)}
              aria-label="Cliente anterior"
            >
              <Icone nome="voltar" tamanho={14} />
            </button>
            <span className="min-w-7 text-center text-[11px] text-muted tabular-nums">
              <span aria-hidden="true">
                {i + 1}/{total}
              </span>
              <span className="sr-only">
                {i + 1} de {total}
              </span>
            </span>
            <button
              type="button"
              className={seta}
              onClick={() => mudar(1)}
              aria-label="Cliente seguinte"
            >
              <Icone nome="seta" tamanho={14} />
            </button>
          </div>
        ),
      )}

      {/* aria-live: quem usa leitor de ecrã ouve o novo cliente ao avançar */}
      <div aria-live="polite">
        <Link
          href={`/clientes/${client.id}`}
          className="group mt-3 flex items-center gap-2.5"
        >
          <Avatar nome={client.company} setor={client.sector} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold group-hover:text-primary-strong">
              {client.company}
            </span>
            <span className="block truncate text-xs text-muted">
              {client.contact_name}
            </span>
          </span>
        </Link>

        <p
          className={`mt-3 text-base font-semibold tracking-tight tabular-nums ${overdue > 0 ? "text-danger" : "text-warning"}`}
        >
          {formatEuro(overdue > 0 ? overdue : atual.total)}
          <span className="ml-1 text-xs font-medium">
            {overdue > 0 ? "em atraso" : "pendente"}
          </span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {rows.length} {rows.length === 1 ? "fatura" : "faturas"} · mais antiga
          há {oldestDays} dias
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={debtorEmailLink(atual)}
          className="btn btn-primary h-9 px-2 text-xs"
          aria-label={`Enviar email a ${client.company}`}
        >
          <Icone nome="email" tamanho={14} />
          Email
        </a>
        <a
          href={phoneLink(client.phone)}
          className="btn btn-secondary h-9 px-2 text-xs"
          aria-label={`Ligar a ${client.contact_name}, ${client.phone}`}
        >
          <Icone nome="telefone" tamanho={13} />
          Ligar
        </a>
      </div>

      <Link
        href="/cobrancas"
        className="mt-3 flex items-center justify-between rounded-md text-xs font-semibold text-primary-strong hover:underline"
      >
        Abrir Cobranças <Icone nome="seta" tamanho={14} />
      </Link>
    </div>
  );
}

export function BarraLateral() {
  const caminho = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 flex h-16 border-t border-border bg-surface md:sticky md:top-0 md:h-screen md:flex-col md:border-t-0 md:border-r md:px-3 md:pt-7 md:pb-5 lg:px-4">
      <Link
        href="/"
        className="hidden px-2 md:flex lg:hidden"
        aria-label="jrl.labs, Visão geral"
      >
        <LogoSimbolo />
      </Link>
      <Link
        href="/"
        className="hidden px-2 lg:flex"
        aria-label="jrl.labs, Visão geral"
      >
        <Logo />
      </Link>

      <nav
        aria-label="Navegação principal"
        className="flex w-full justify-around md:mt-10 md:flex-col md:justify-start md:gap-1"
      >
        <p className="eyebrow mb-2 hidden px-3 !text-muted lg:block">Agência</p>
        {navegacao.map((item) => {
          const ativo = estaAtivo(caminho, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              title={item.rotulo}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[11px] transition-colors md:h-11 md:flex-none md:flex-row md:justify-center md:text-sm lg:justify-start lg:gap-3 lg:px-3 ${
                ativo
                  ? "font-semibold text-primary-strong md:bg-primary-soft"
                  : "font-medium text-muted hover:text-text md:hover:bg-surface-soft"
              }`}
            >
              <Icone nome={item.icone} />
              <span className="md:hidden lg:inline">{item.rotulo}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden lg:block">
        <CartaoContactar />
      </div>
    </aside>
  );
}
