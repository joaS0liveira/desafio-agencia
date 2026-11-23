import { LogoMark, LogoSignature, LogoWordmark } from "@/components/ui/Logo";

/**
 * Ecrã de entrada da jrl.fin (só na primeira abertura da sessão; ver layout.tsx).
 * As barras do gráfico crescem, a seta sobe, aparece "jrl.fin" e a assinatura,
 * e uma barra fina de progresso enche. Animações em globals.css (.splash-*).
 */
export function SplashScreen() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-content">
        <div className="flex items-center gap-4 sm:gap-5">
          <LogoMark size={64} />
          <LogoWordmark className="splash-wordmark text-[52px] text-text sm:text-[64px]" />
        </div>
        <LogoSignature
          lines
          className="splash-signature -mt-2 text-sm sm:text-base"
        />
        <div className="splash-progress mt-4">
          <i />
        </div>
      </div>
    </div>
  );
}
