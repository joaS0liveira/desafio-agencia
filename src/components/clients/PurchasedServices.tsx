import { Panel } from "@/components/ui/Panel";
import { ProportionBar } from "@/components/ui/ProportionBar";
import { formatEuro } from "@/lib/format";
import type { ServiceRevenue } from "@/types/reports";

export function PurchasedServices({
  services,
  missing,
}: {
  services: ServiceRevenue[];
  missing: string[];
}) {
  const largest = services[0]?.revenue ?? 0;
  return (
    <Panel title="Serviços comprados" subtitle="Quanto gastou em cada serviço">
      <div className="px-5">
        {services.map((s, i) => (
          <ProportionBar
            key={s.service}
            label={s.service}
            value={formatEuro(s.revenue)}
            ratio={largest ? s.revenue / largest : 0}
            highlight={i === 0}
          />
        ))}
      </div>
      {/* "Oportunidade" só aparece quando há mesmo uma (serviços por vender) */}
      {missing.length > 0 ? (
        <div className="m-5 mt-3 rounded-lg bg-primary-soft p-4 text-sm">
          <p className="font-semibold text-primary-strong">Oportunidade</p>
          <p className="mt-1">Ainda não comprou: {missing.join(", ")}.</p>
        </div>
      ) : (
        <p className="m-5 mt-3 rounded-lg bg-surface-soft p-4 text-sm text-muted">
          Já compra todos os serviços da agência.
        </p>
      )}
    </Panel>
  );
}
