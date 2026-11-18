import type { Client, Order } from "@/types";

// Ações dos botões: links mailto: e tel:, e o texto do CSV.
// Funções puras: só constroem texto. Abrir o link ou descarregar o ficheiro fica no componente.

const euros = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function dataPt(texto: string): string {
  const [ano, mes, dia] = texto.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** mailto: com assunto e corpo opcionais, já codificados para URL. */
export function linkEmail(
  email: string,
  assunto?: string,
  corpo?: string,
): string {
  const partes: string[] = [];
  if (assunto) partes.push(`subject=${encodeURIComponent(assunto)}`);
  if (corpo) partes.push(`body=${encodeURIComponent(corpo)}`);
  return partes.length
    ? `mailto:${email}?${partes.join("&")}`
    : `mailto:${email}`;
}

/** Email de cobrança com o serviço, a data e o valor já preenchidos. */
export function linkEmailCobranca(cliente: Client, encomenda: Order): string {
  const valor = euros.format(encomenda.amount);
  const titulo =
    encomenda.status === "Em atraso" ? "Fatura em atraso" : "Fatura pendente";
  const assunto = `${titulo}: ${encomenda.service}, ${valor}`;
  const corpo = [
    `Olá ${cliente.contact_name},`,
    "",
    `Lembramos que a fatura de ${encomenda.service}, emitida a ${dataPt(encomenda.date)}, no valor de ${valor}, ainda não foi paga.`,
    "",
    "Obrigado,",
    "Agência",
  ].join("\n");
  return linkEmail(cliente.email, assunto, corpo);
}

/** tel: a partir de "230 519 584" -> "tel:+351230519584". */
export function linkTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "");
  return digitos.startsWith("351") ? `tel:+${digitos}` : `tel:+351${digitos}`;
}

type Celula = string | number | null | undefined;

function celulaCsv(valor: Celula, separador: string): string {
  const texto = valor == null ? "" : String(valor);
  const precisaAspas = /["\r\n]/.test(texto) || texto.includes(separador);
  return precisaAspas ? `"${texto.replaceAll('"', '""')}"` : texto;
}

/**
 * Converte linhas num CSV. Usa ";" por defeito, que é o que o Excel em português espera.
 * `colunas` = pares [chave, cabeçalho], pela ordem em que aparecem no ficheiro.
 */
export function paraCsv<T extends Record<string, Celula>>(
  linhas: T[],
  colunas: [keyof T & string, string][],
  separador = ";",
): string {
  const cabecalho = colunas
    .map(([, titulo]) => celulaCsv(titulo, separador))
    .join(separador);
  const corpo = linhas.map((linha) =>
    colunas
      .map(([chave]) => celulaCsv(linha[chave], separador))
      .join(separador),
  );
  return [cabecalho, ...corpo].join("\r\n");
}
