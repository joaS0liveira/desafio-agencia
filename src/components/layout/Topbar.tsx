"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo";
import { useAppData } from "@/hooks/useAppData";
import { latestDate } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { useStore } from "@/store/useStore";

export function Topbar() {
  const { orders, loading } = useAppData();
  const error = useStore((s) => s.error);
  const latest = loading ? null : latestDate(orders);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-8">
      <span className="md:hidden">
        <LogoMark size={28} />
      </span>
      <p className="flex items-center gap-2 text-xs text-muted">
        <i
          className={`size-1.5 rounded-full ${error ? "bg-danger" : "bg-accent"}`}
          aria-hidden="true"
        />
        {error ? (
          "Dados indisponíveis"
        ) : latest ? (
          <span>
            Dados até {formatDate(latest)}
            <span className="hidden sm:inline">
              {" "}
              · {orders.length} encomendas
            </span>
          </span>
        ) : (
          "A carregar dados…"
        )}
      </p>
      <ThemeToggle />
    </header>
  );
}
