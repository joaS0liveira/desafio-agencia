"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// O tema vive no atributo data-theme do <html> (definido antes da pintura pelo script do layout).
function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Muda o tema da página e guarda a escolha para a próxima visita. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage indisponível (modo privado): o tema só dura esta visita
  }
}

/** Tema atual ("light" ou "dark"), sempre atualizado quando o utilizador o muda. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
