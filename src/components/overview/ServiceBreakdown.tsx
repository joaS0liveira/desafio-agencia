"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { formatEuro, formatPercent } from "@/lib/format";
import type { ServiceRevenue } from "@/types/reports";

// Geometria do medidor: um arco de 270° com a abertura em baixo, feito de traços.
const TICKS = 32;
const ARC = 270;
const CENTER = 110;
const INNER_RADIUS = 72;
const OUTER_RADIUS = 94;

/** Ponto a `raio` do centro, no ângulo `graus` (0° = topo, sentido dos ponteiros). */
function point(degrees: number, radius: number) {
  const rad = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

/**
 * Para cada traço, o índice do serviço a que pertence.
 * Cada serviço fica com um bloco seguido de traços proporcional à sua parte da faturação.
 */
function ticksPerService(services: ServiceRevenue[], total: number) {
  const bounds: number[] = [];
  let cumulative = 0;
  for (const s of services) {
    cumulative += total ? s.revenue / total : 0;
    bounds.push(cumulative);
  }
  return Array.from({ length: TICKS }, (_, i) => {
    const middle = (i + 0.5) / TICKS;
    const index = bounds.findIndex((limit) => middle <= limit);
    return index === -1 ? services.length - 1 : index;
  });
}

/** true se o sistema pede menos movimento (aí as animações saltam para o fim). */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const average = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(average.matches);
    const update = () => setReduced(average.matches);
    average.addEventListener("change", update);
    return () => average.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Número que desliza do valor anterior até `alvo` (ease-out), em `duracao` ms. */
function useAnimatedNumber(
  target: number,
  duration: number,
  disabled: boolean,
) {
  const [value, setValue] = useState(disabled ? target : 0);
  const current = useRef(value);

  useEffect(() => {
    if (disabled) {
      current.current = target;
      setValue(target);
      return;
    }
    const start = current.current;
    const t0 = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out cúbico
      current.current = start + (target - start) * eased;
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, disabled]);

  return value;
}

/**
 * `filtrado` = o serviço escolhido no filtro da página: fica destacado no medidor.
 * Clicar na lista muda o destaque só neste card, sem mexer nos filtros.
 */
export function ServiceBreakdown({
  services,
  filtered = null,
}: {
  services: ServiceRevenue[];
  filtered?: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(filtered);

  const total = services.reduce((sum, s) => sum + s.revenue, 0);
  // Se o serviço escolhido sair com os filtros, volta ao primeiro (o que mais fatura)
  const current =
    services.find((s) => s.service === selected) ?? services[0] ?? null;
  const owners = ticksPerService(services, total);

  // Animação: ao abrir, os traços aparecem da esquerda para a direita e a fatia
  // escolhida acende em sequência; ao trocar de serviço, a nova fatia acende traço a traço.
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const currentIndex = current ? services.indexOf(current) : -1;
  const firstTick = owners.indexOf(currentIndex);
  const part = total && current ? current.revenue / total : 0;
  const animatedPart = useAnimatedNumber(part, 900, reducedMotion);

  return (
    <Panel
      title="Por serviço"
      subtitle="Parte de cada serviço na faturação. Clica num serviço para o destacar."
    >
      <div className="relative mx-auto w-full max-w-[270px] px-5">
        <svg
          viewBox="0 0 220 196"
          className="w-full"
          role="img"
          aria-label={
            current
              ? `${current.service}: ${formatPercent(current.revenue / total)} da faturação`
              : "Sem dados"
          }
        >
          {owners.map((index, i) => {
            const angle = -ARC / 2 + ((i + 0.5) / TICKS) * ARC;
            const a = point(angle, INNER_RADIUS);
            const b = point(angle, OUTER_RADIUS);
            const active = ready && services[index] === current;
            // Os traços que acendem entram um a um; os que apagam saem logo
            const delay = reducedMotion
              ? 0
              : active
                ? (i - firstTick) * 28 + 120
                : 0;
            return (
              <line
                // biome-ignore lint/suspicious/noArrayIndexKey: os traços são fixos, a posição é a identidade
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={8}
                strokeLinecap="round"
                style={{
                  stroke: active ? "var(--brand)" : "var(--border)",
                  opacity: ready ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `stroke 0.3s ease-out ${delay}ms, opacity 0.4s ease-out ${i * 14}ms`,
                }}
              />
            );
          })}
        </svg>

        {current && (
          <div className="pointer-events-none absolute inset-x-0 top-[34%] text-center">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatPercent(animatedPart)}
            </p>
            <p className="mx-auto mt-0.5 max-w-[150px] text-xs leading-snug text-muted">
              {current.service}
            </p>
          </div>
        )}
      </div>

      <ul className="px-3 pb-3">
        {services.map((s) => {
          const active = s === current;
          return (
            <li key={s.service}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(s.service)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[13px] transition-colors ${
                  active ? "bg-primary-soft" : "hover:bg-surface-soft"
                }`}
              >
                <i
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${active ? "bg-brand" : "bg-border"}`}
                />
                <span className="min-w-0 flex-1 leading-snug">
                  {s.service}{" "}
                  <span className="text-xs text-muted">· {s.count}</span>
                </span>
                <span className="w-9 text-right text-xs text-muted tabular-nums">
                  {formatPercent(total ? s.revenue / total : 0)}
                </span>
                <strong className="w-24 text-right font-semibold tabular-nums">
                  {formatEuro(s.revenue)}
                </strong>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
