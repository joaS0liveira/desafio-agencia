import { sectorColors } from "@/components/ui/SectorIcon";
import { initials } from "@/lib/format";

/** Iniciais da empresa num quadrado com a cor do setor (ex.: Saúde a vermelho). */
export function Avatar({
  name,
  sector,
  size = "md",
}: {
  name: string;
  sector: string;
  size?: "md" | "lg";
}) {
  const classes =
    size === "lg"
      ? "size-14 rounded-xl text-lg"
      : "size-8 rounded-lg text-[11px]";
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center font-bold ${classes}`}
      style={sectorColors(sector)}
    >
      {initials(name)}
    </span>
  );
}
