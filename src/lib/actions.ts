import { type Client, ORDER_STATUS, type Order } from "../types/index.ts";
import { formatDate, formatEuro } from "./format.ts";

export function emailLink(
  email: string,
  subject?: string,
  body?: string,
): string {
  const query: string[] = [];
  if (subject) query.push(`subject=${encodeURIComponent(subject)}`);
  if (body) query.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${query.length ? `?${query.join("&")}` : ""}`;
}

export function collectionEmailLink(client: Client, order: Order): string {
  const amount = formatEuro(order.amount);
  const title =
    order.status === ORDER_STATUS.overdue
      ? "Fatura em atraso"
      : "Fatura pendente";
  const subject = `${title}: ${order.service}, ${amount}`;
  const body = [
    `Olá ${client.contact_name},`,
    "",
    `Lembramos que a fatura de ${order.service}, emitida a ${formatDate(order.date)}, no valor de ${amount}, ainda não foi paga.`,
    "",
    "Obrigado,",
    "Agência",
  ].join("\n");
  return emailLink(client.email, subject, body);
}

export function phoneLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("351") ? digits : `351${digits}`}`;
}

type CsvCell = string | number | null | undefined;

function escapeCell(value: CsvCell, separator: string): string {
  const text = String(value ?? "");
  return /["\r\n]/.test(text) || text.includes(separator)
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

export function toCsv<Key extends string>(
  rows: Record<Key, CsvCell>[],
  columns: [Key, string][],
  separator = ";",
): string {
  const header = columns
    .map(([, title]) => escapeCell(title, separator))
    .join(separator);
  const body = rows.map((row) =>
    columns.map(([key]) => escapeCell(row[key], separator)).join(separator),
  );
  return [header, ...body].join("\r\n");
}
