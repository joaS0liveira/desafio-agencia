import type { Order } from "@/types";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** "2025-11-03" -> Date (em UTC, para não mudar de dia com o fuso horário). */
export function paraData(texto: string): Date {
  return new Date(`${texto}T00:00:00Z`);
}

/** Dias inteiros de `inicio` até `fim` (datas em texto "AAAA-MM-DD"). */
export function diasEntre(inicio: string, fim: string): number {
  return Math.round(
    (paraData(fim).getTime() - paraData(inicio).getTime()) / MS_POR_DIA,
  );
}

/**
 * Data da encomenda mais recente. É a referência para "há X dias" e
 * "últimos 30 dias": conta a partir do último registo, não de hoje.
 */
export function dataMaisRecente(encomendas: Order[]): string | null {
  let maisRecente: string | null = null;
  for (const encomenda of encomendas) {
    if (maisRecente === null || encomenda.date > maisRecente) {
      maisRecente = encomenda.date;
    }
  }
  return maisRecente;
}
