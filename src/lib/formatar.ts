// formatar moeda/amount

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: "always", // pt-PT não agrupa 4 dígitos por defeito: 3000 → "3000 €"
});


export const formatEuro = (amount: number): string => euro.format(amount);

//formatar milhares para acumulados

export const formatK = (amount: number): string =>
  `${Math.round(amount / 1000)}k`;

//percentagem

export const formatPercent = (ratio: number): string =>
  `${Math.round(ratio * 100)}%`;

// formata o nome dos clientes/empresas

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join(""); // "Vale Verde Agro" → "VV"

// converte data de 2025-11-01 para "2025-11"

export function monthKey(date: string): string {
  return date.slice(0, 7);
}