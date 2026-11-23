"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { useAppData } from "@/hooks/useAppData";
import { phoneLink } from "@/lib/actions";
import { collectionRows } from "@/lib/collections";
import { type Debtor, debtorEmailLink, debtorsByClient } from "@/lib/debtors";
import { formatEuro } from "@/lib/format";
import { useStore } from "@/store/useStore";

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Visão geral", icon: "home" },
  { href: "/cobrancas", label: "Cobranças", icon: "receipt" },
  { href: "/clientes", label: "Clientes", icon: "users" },
];

function isActiveRoute(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Conteúdo do pop-up "A contactar": a fila de quem contactar (a mesma ordem de Cobranças:
 * mais em atraso primeiro). Mostra um cliente de cada vez, com Email e Ligar à mão,
 * e deixa avançar na fila sem sair da página.
 */
function ContactCard({
  debtors,
  onFechar,
}: {
  debtors: Debtor[];
  onFechar: () => void;
}) {
  const [position, setPosition] = useState(0);

  // Cabeçalho só com o título e o X, para caber na largura da barra lateral
  const header = (
    <div className="-mt-1 -mr-1 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
        <Icon name="phone" size={13} className="text-brand" />A contactar
      </h2>
      <button
        type="button"
        onClick={onFechar}
        className="grid size-7 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-text"
        aria-label="Fechar A contactar"
        title="Fechar"
      >
        <Icon name="close" size={15} />
      </button>
    </div>
  );

  if (!debtors.length) {
    return (
      <div>
        {header}
        <p className="mt-2 text-xs text-muted">
          Ninguém deve nada. Bom trabalho!
        </p>
      </div>
    );
  }

  const total = debtors.length;
  const i = position % total;
  const current = debtors[i];
  const { client, overdue, oldestDays, rows } = current;
  const update = (step: number) => setPosition((i + step + total) % total);
  const arrowButton =
    "grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-text";

  return (
    <div>
      {header}

      {/* aria-live: quem usa leitor de ecrã ouve o novo cliente ao avançar */}
      <div aria-live="polite">
        <Link
          href={`/clientes/${client.id}`}
          className="group mt-3 flex items-center gap-2.5"
        >
          <Avatar name={client.company} sector={client.sector} />
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
          {formatEuro(overdue > 0 ? overdue : current.total)}
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
          href={debtorEmailLink(current)}
          className="btn btn-primary h-9 px-2 text-xs"
          aria-label={`Enviar email a ${client.company}`}
        >
          <Icon name="email" size={14} />
          Email
        </a>
        <a
          href={phoneLink(client.phone)}
          className="btn btn-secondary h-9 px-2 text-xs"
          aria-label={`Ligar a ${client.contact_name}, ${client.phone}`}
        >
          <Icon name="phone" size={13} />
          Ligar
        </a>
      </div>

      {/* Rodapé: link para Cobranças e, à direita, avançar/recuar na fila */}
      <div className="mt-2 -mr-1 -mb-1 flex items-center justify-between gap-2">
        <Link
          href="/cobrancas"
          className="rounded-md text-xs font-semibold whitespace-nowrap text-primary-strong hover:underline"
        >
          Abrir Cobranças
        </Link>
        {total > 1 && (
          <div className="flex items-center">
            <button
              type="button"
              className={arrowButton}
              onClick={() => update(-1)}
              aria-label="Cliente anterior"
            >
              <Icon name="arrowLeft" size={14} />
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
              className={arrowButton}
              onClick={() => update(1)}
              aria-label="Cliente seguinte"
            >
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-x-0 bottom-0 z-20 flex h-16 border-t border-border bg-surface md:sticky md:top-0 md:h-screen md:flex-col md:border-t-0 md:border-r md:px-3 md:pt-7 md:pb-5 lg:px-4">
        <Link
          href="/"
          className="hidden px-2 md:flex lg:hidden"
          aria-label="jrl.fin, Visão geral"
        >
          <LogoMark />
        </Link>
        <Link
          href="/"
          className="hidden px-2 lg:flex"
          aria-label="jrl.fin, Visão geral"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="flex w-full justify-around md:mt-10 md:flex-col md:justify-start md:gap-1"
        >
          <p className="eyebrow mb-2 hidden px-3 !text-muted lg:block">
            Agência
          </p>
          {navigation.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[11px] transition-colors md:h-11 md:flex-none md:flex-row md:justify-center md:text-sm lg:justify-start lg:gap-3 lg:px-3 ${
                  active
                    ? "font-semibold text-primary-strong md:bg-primary-soft"
                    : "font-medium text-muted hover:text-text md:hover:bg-surface-hover"
                }`}
              >
                {/* Marca do item ativo: traço laranja no topo (telemóvel) ou à esquerda */}
                {active && (
                  <i
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-brand md:top-1/2 md:left-0 md:h-5 md:w-[3px] md:-translate-y-1/2"
                  />
                )}
                <Icon
                  name={item.icon}
                  className={active ? "text-brand" : undefined}
                />
                <span className="md:hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <ContactPopup />
    </>
  );
}

const CLOSED_KEY = "contact-closed";

/**
 * "A contactar" num pop-up no canto inferior direito, por cima de todas as páginas.
 * Fecha-se no X (ou com Esc) e fica um botão pequeno para o voltar a abrir.
 * A escolha fica guardada na sessão do separador (volta a abrir na próxima visita).
 */
function ContactPopup() {
  const { clients, orders, loading } = useAppData();
  const error = useStore((s) => s.error);
  const debtors = useMemo(
    () => debtorsByClient(collectionRows(orders, clients)),
    [orders, clients],
  );
  // null até ler a sessão: evita mostrar o pop-up e escondê-lo logo a seguir
  const [isOpen, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let closed = false;
    try {
      closed = sessionStorage.getItem(CLOSED_KEY) === "1";
    } catch {}
    setOpen(!closed);
  }, []);

  const update = useCallback((value: boolean) => {
    setOpen(value);
    try {
      if (value) sessionStorage.removeItem(CLOSED_KEY);
      else sessionStorage.setItem(CLOSED_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") update(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, update]);

  if (isOpen === null || loading || error) return null;

  // No computador fica dentro da barra lateral, no fundo (a barra tem 248px e 16px de margem).
  // No tablet a barra só tem ícones (76px), por isso fica logo ao lado; no telemóvel, acima da navegação.
  const position =
    "fixed bottom-20 left-4 z-30 md:bottom-6 md:left-[calc(76px+1.5rem)] lg:bottom-5 lg:left-4";
  const width = "w-[min(320px,calc(100vw-2rem))] lg:w-[216px]";

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => update(true)}
        className={`${position} popup-enter flex h-11 items-center gap-2 rounded-full border border-border bg-surface pr-4 pl-3.5 text-sm font-semibold shadow-card-hover transition-colors hover:border-border-strong`}
        aria-label={`Abrir A contactar, ${debtors.length} clientes`}
      >
        <Icon name="phone" size={16} className="text-brand" />A contactar
        {debtors.length > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-on-primary tabular-nums">
            {debtors.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <section
      aria-label="A contactar"
      className={`${position} ${width} popup-enter rounded-2xl border border-border bg-surface p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.28)]`}
    >
      <ContactCard debtors={debtors} onFechar={() => update(false)} />
    </section>
  );
}
