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

interface SectorStyle {
  icon: LucideIcon;
  color: string;
  text: string;
}

const sectors: Record<string, SectorStyle> = {
  Agroalimentar: { icon: Beef, color: "#8a5a2b", text: "#ffffff" },
  Comércio: { icon: ShoppingCart, color: "#b04e0a", text: "#ffffff" },
  Construção: { icon: Hammer, color: "#e2a919", text: "#2b2100" },
  Energia: { icon: PlugZap, color: "#be185d", text: "#ffffff" },
  Turismo: { icon: Binoculars, color: "#0b78b8", text: "#ffffff" },
  Indústria: { icon: Factory, color: "#1f3a68", text: "#ffffff" },
  Saúde: { icon: Cross, color: "#d92d20", text: "#ffffff" },
  Serviços: { icon: Headset, color: "#7a3fb0", text: "#ffffff" },
};

export function sectorColors(sector: string) {
  const style = sectors[sector];
  return style
    ? { backgroundColor: style.color, color: style.text }
    : { backgroundColor: "var(--primary)", color: "var(--on-primary)" };
}

export function SectorIcon({
  sector,
  size = 17,
  className = "",
}: {
  sector: string;
  size?: number;
  className?: string;
}) {
  const Icon = sectors[sector]?.icon;
  if (!Icon) return null;
  return (
    <Icon
      size={size}
      strokeWidth={2}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
}

export function SectorLabel({ sector }: { sector: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <SectorIcon sector={sector} className="text-primary" />
      {sector}
    </span>
  );
}
