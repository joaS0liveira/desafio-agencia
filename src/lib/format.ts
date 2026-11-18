export const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: "always",
});

export const formatEuro = (amount: number): string => euro.format(amount);
export const formatThousands = (amount: number): string =>
  `${Math.round(amount / 1000)}k`;
export const formatPercent = (ratio: number): string =>
  `${Math.round(ratio * 100)}%`;

export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
