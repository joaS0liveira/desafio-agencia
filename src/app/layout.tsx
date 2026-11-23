import type { Metadata } from "next";
import { IBM_Plex_Sans, Outfit } from "next/font/google";
import { DataGuard } from "@/components/layout/DataGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Topbar } from "@/components/layout/Topbar";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Letra geométrica só para o logótipo "jrl.fin" e a assinatura
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "jrl.fin · Painel financeiro",
    template: "%s · jrl.fin",
  },
  description:
    "jrl.fin, produto da jrl.labs: faturação, cobranças e clientes da agência, a partir dos dados do Excel.",
};

// Corre antes da primeira pintura:
// 1) aplica o tema guardado (evita o "flash" de modo claro);
// 2) mostra o ecrã de entrada só na primeira abertura da sessão (separador),
//    para não atrasar quem abre o painel várias vezes por dia.
const startupScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t)}catch(e){}try{if(sessionStorage.getItem("splash-seen")){d.setAttribute("data-splash","seen")}else{sessionStorage.setItem("splash-seen","1")}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      data-theme="light"
      className={`${plex.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: script fixo, sem dados do utilizador */}
        <script dangerouslySetInnerHTML={{ __html: startupScript }} />
        {/* Esconde o ecrã de entrada se já foi visto nesta sessão (o script acima marca o <html>) */}
        <style>{`[data-splash="seen"] .splash{display:none}`}</style>
      </head>
      <body className="min-h-screen">
        {/* Para quem navega com teclado: salta o menu e vai direto ao conteúdo */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-card"
        >
          Saltar para o conteúdo
        </a>
        <SplashScreen />
        <div className="md:grid md:grid-cols-[76px_1fr] lg:grid-cols-[248px_1fr]">
          <Sidebar />
          <div className="min-w-0 pb-16 md:pb-0">
            <Topbar />
            <main
              id="conteudo"
              tabIndex={-1}
              className="mx-auto max-w-[1400px] px-4 py-6 outline-none sm:px-8 sm:py-8"
            >
              <DataGuard>{children}</DataGuard>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
