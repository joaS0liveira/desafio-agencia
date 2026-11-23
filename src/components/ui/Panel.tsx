import type { ReactNode } from "react";

// Painel: título, subtítulo opcional e ações à direita

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`card flex min-w-0 flex-col overflow-hidden
      ${className}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {actions && (
          <div className="ml-auto flex max-w-full flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </header>
      {children}
    </section>
  );
}

// Título da página: título, descrição e ações

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </section>
  );
}
