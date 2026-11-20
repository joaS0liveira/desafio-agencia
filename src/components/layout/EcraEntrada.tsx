import { LogoSimbolo } from "@/components/ui/Logo";

export function EcraEntrada() {
  return (
    <div className="entrada" aria-hidden="true">
      <div className="entrada-logo">
        <span className="entrada-simbolo">
          <LogoSimbolo tamanho={84} />
        </span>
        {/* A coluna abre de 0 até à largura do texto; o texto desliza de trás do símbolo */}
        <span className="entrada-texto">
          <span className="entrada-palavra">
            <span className="entrada-interior">
              <span className="font-bold">jrl</span>
              <span className="font-bold text-accent">.</span>
              <span className="font-light">labs</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
