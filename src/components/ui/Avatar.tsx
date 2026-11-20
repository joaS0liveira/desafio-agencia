import { initials } from "@/lib/format";
import { coresSetor } from "./IconeSetor";

/** Iniciais da empresa num quadrado com a cor do setor (ex.: Saúde a vermelho). */
export function Avatar({
  nome,
  setor,
  tamanho = "md",
}: {
  nome: string;
  setor: string;
  tamanho?: "md" | "lg";
}) {
  const classes =
    tamanho === "lg"
      ? "size-14 rounded-xl text-lg"
      : "size-8 rounded-lg text-[11px]";
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center font-bold ${classes}`}
      style={coresSetor(setor)}
    >
      {initials(nome)}
    </span>
  );
}
