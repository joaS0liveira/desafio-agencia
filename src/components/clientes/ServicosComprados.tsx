import { BarraProporcional } from "@/components/ui/BarraProporcional";
import { Bloco } from "@/components/ui/Bloco";
import { formatEuro } from "@/lib/format";
import type { ServiceRevenue } from "@/types/reports";

export function ServicosComprados({
  servicos,
  emFalta,
}: {
  servicos: ServiceRevenue[];
  emFalta: string[];
}) {
  const maior = servicos[0]?.revenue ?? 0;
  return (
    <Bloco
      titulo="Serviços comprados"
      subtitulo="Quanto gastou em cada serviço"
    >
      <div className="px-5">
        {servicos.map((s, i) => (
          <BarraProporcional
            key={s.service}
            rotulo={s.service}
            valor={formatEuro(s.revenue)}
            proporcao={maior ? s.revenue / maior : 0}
            destaque={i === 0}
          />
        ))}
      </div>
      {/* "Oportunidade" só aparece quando há mesmo uma (serviços por vender) */}
      {emFalta.length > 0 ? (
        <div className="m-5 mt-3 rounded-lg bg-primary-soft p-4 text-sm">
          <p className="font-semibold text-primary-strong">Oportunidade</p>
          <p className="mt-1">Ainda não comprou: {emFalta.join(", ")}.</p>
        </div>
      ) : (
        <p className="m-5 mt-3 rounded-lg bg-surface-soft p-4 text-sm text-muted">
          Já compra todos os serviços da agência.
        </p>
      )}
    </Bloco>
  );
}
