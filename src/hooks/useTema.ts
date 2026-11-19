"use client";

import { useSyncExternalStore } from "react";

export type Tema = "light" | "dark";

// O tema vive no atributo data-theme do <html> (definido antes da pintura pelo script do layout).
function lerTema(): Tema {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscrever(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observador.disconnect();
}

/** Muda o tema da página e guarda a escolha para a próxima visita. */
export function mudarTema(tema: Tema) {
  document.documentElement.dataset.theme = tema;
  try {
    localStorage.setItem("theme", tema);
  } catch {
    // localStorage indisponível (modo privado): o tema só dura esta visita
  }
}

/** Tema atual ("light" ou "dark"), sempre atualizado quando o utilizador o muda. */
export function useTema(): Tema {
  return useSyncExternalStore(subscrever, lerTema, () => "light");
}
