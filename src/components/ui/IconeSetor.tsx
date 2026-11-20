import {
  Beef,
  Binoculars,
  Cross,
  Factory,
  Hammer,
  Headset,
  type LucideIcon,
  PlugZap,
  ShoppingCart,
} from "lucide-react";

interface EstiloSetor {
  icone: LucideIcon;
  cor: string;
  texto: string;
}

const setores: Record<string, EstiloSetor> = {
  Agroalimentar: { icone: Beef, cor: "#8a5a2b", texto: "#ffffff" },
  Comércio: { icone: ShoppingCart, cor: "#b04e0a", texto: "#ffffff" },
  Construção: { icone: Hammer, cor: "#e2a919", texto: "#2b2100" },
  Energia: { icone: PlugZap, cor: "#0d7a70", texto: "#ffffff" },
  Turismo: { icone: Binoculars, cor: "#0b78b8", texto: "#ffffff" },
  Indústria: { icone: Factory, cor: "#1f3a68", texto: "#ffffff" },
  Saúde: { icone: Cross, cor: "#d92d20", texto: "#ffffff" },
  Serviços: { icone: Headset, cor: "#7a3fb0", texto: "#ffffff" },
};

export function coresSetor(setor: string) {
  const estilo = setores[setor];
  return estilo
    ? { backgroundColor: estilo.cor, color: estilo.texto }
    : { backgroundColor: "var(--primary)", color: "var(--on-primary)" };
}

export function IconeSetor({
  setor,
  tamanho = 17,
  className = "",
}: {
  setor: string;
  tamanho?: number;
  className?: string;
}) {
  const Icone = setores[setor]?.icone;
  if (!Icone) return null;
  return (
    <Icone
      size={tamanho}
      strokeWidth={2}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
}

export function EtiquetaSetor({ setor }: { setor: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <IconeSetor setor={setor} className="text-primary" />
      {setor}
    </span>
  );
}
