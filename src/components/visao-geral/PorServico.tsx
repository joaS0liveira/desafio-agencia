"use client";

import { useEffect, useRef, useState } from "react";
import { Bloco } from "@/components/ui/Bloco";
import { formatEuro, formatPercent } from "@/lib/format";
import type { ServiceRevenue } from "@/types/reports";

// Geometria do medidor: um arco de 270° com a abertura em baixo, feito de traços.
const TRACOS = 32;
const ARCO = 270;
const CENTRO = 110;
const RAIO_DENTRO = 72;
const RAIO_FORA = 94;

/** Ponto a `raio` do centro, no ângulo `graus` (0° = topo, sentido dos ponteiros). */
function ponto(graus: number, raio: number) {
  const rad = (graus * Math.PI) / 180;
  return {
    x: CENTRO + raio * Math.sin(rad),
    y: CENTRO - raio * Math.cos(rad),
  };
}

/**
 * Para cada traço, o índice do serviço a que pertence.
 * Cada serviço fica com um bloco seguido de traços proporcional à sua parte da faturação.
 */
function tracosPorServico(servicos: ServiceRevenue[], total: number) {
  const limites: number[] = [];
  let acumulado = 0;
  for (const s of servicos) {
    acumulado += total ? s.revenue / total : 0;
    limites.push(acumulado);
  }
  return Array.from({ length: TRACOS }, (_, i) => {
    const meio = (i + 0.5) / TRACOS;
    const indice = limites.findIndex((limite) => meio <= limite);
    return indice === -1 ? servicos.length - 1 : indice;
  });
}

/** true se o sistema pede menos movimento (aí as animações saltam para o fim). */
function useMenosMovimento() {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setMenos(media.matches);
    const mudar = () => setMenos(media.matches);
    media.addEventListener("change", mudar);
    return () => media.removeEventListener("change", mudar);
  }, []);
  return menos;
}

/** Número que desliza do valor anterior até `alvo` (ease-out), em `duracao` ms. */
function useNumeroAnimado(alvo: number, duracao: number, desligado: boolean) {
  const [valor, setValor] = useState(desligado ? alvo : 0);
  const atual = useRef(valor);

  useEffect(() => {
    if (desligado) {
      atual.current = alvo;
      setValor(alvo);
      return;
    }
    const inicio = atual.current;
    const t0 = performance.now();
    let frame = 0;
    const passo = (agora: number) => {
      const t = Math.min((agora - t0) / duracao, 1);
      const suave = 1 - (1 - t) ** 3; // ease-out cúbico
      atual.current = inicio + (alvo - inicio) * suave;
      setValor(atual.current);
      if (t < 1) frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [alvo, duracao, desligado]);

  return valor;
}

/**
 * `filtrado` = o serviço escolhido no filtro da página: fica destacado no medidor.
 * Clicar na lista muda o destaque só neste card, sem mexer nos filtros.
 */
export function PorServico({
  servicos,
  filtrado = null,
}: {
  servicos: ServiceRevenue[];
  filtrado?: string | null;
}) {
  const [escolhido, setEscolhido] = useState<string | null>(filtrado);

  const total = servicos.reduce((soma, s) => soma + s.revenue, 0);
  // Se o serviço escolhido sair com os filtros, volta ao primeiro (o que mais fatura)
  const atual =
    servicos.find((s) => s.service === escolhido) ?? servicos[0] ?? null;
  const dono = tracosPorServico(servicos, total);

  // Animação: ao abrir, os traços aparecem da esquerda para a direita e a fatia
  // escolhida acende em sequência; ao trocar de serviço, a nova fatia acende traço a traço.
  const menosMovimento = useMenosMovimento();
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPronto(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const indiceAtual = atual ? servicos.indexOf(atual) : -1;
  const primeiroTraco = dono.indexOf(indiceAtual);
  const parte = total && atual ? atual.revenue / total : 0;
  const parteAnimada = useNumeroAnimado(parte, 900, menosMovimento);

  return (
    <Bloco
      titulo="Por serviço"
      subtitulo="Parte de cada serviço na faturação. Clica num serviço para o destacar."
    >
      <div className="relative mx-auto w-full max-w-[270px] px-5">
        <svg
          viewBox="0 0 220 196"
          className="w-full"
          role="img"
          aria-label={
            atual
              ? `${atual.service}: ${formatPercent(atual.revenue / total)} da faturação`
              : "Sem dados"
          }
        >
          {dono.map((indice, i) => {
            const angulo = -ARCO / 2 + ((i + 0.5) / TRACOS) * ARCO;
            const a = ponto(angulo, RAIO_DENTRO);
            const b = ponto(angulo, RAIO_FORA);
            const ativo = pronto && servicos[indice] === atual;
            // Os traços que acendem entram um a um; os que apagam saem logo
            const atraso = menosMovimento
              ? 0
              : ativo
                ? (i - primeiroTraco) * 28 + 120
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
                  stroke: ativo ? "var(--accent)" : "var(--border)",
                  opacity: pronto ? 1 : 0,
                  transition: menosMovimento
                    ? "none"
                    : `stroke 0.3s ease-out ${atraso}ms, opacity 0.4s ease-out ${i * 14}ms`,
                }}
              />
            );
          })}
        </svg>

        {atual && (
          <div className="pointer-events-none absolute inset-x-0 top-[34%] text-center">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatPercent(parteAnimada)}
            </p>
            <p className="mx-auto mt-0.5 max-w-[150px] text-xs leading-snug text-muted">
              {atual.service}
            </p>
          </div>
        )}
      </div>

      <ul className="px-3 pb-3">
        {servicos.map((s) => {
          const ativo = s === atual;
          return (
            <li key={s.service}>
              <button
                type="button"
                aria-pressed={ativo}
                onClick={() => setEscolhido(s.service)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[13px] transition-colors ${
                  ativo ? "bg-primary-soft" : "hover:bg-surface-soft"
                }`}
              >
                <i
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${ativo ? "bg-accent" : "bg-border"}`}
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
    </Bloco>
  );
}
