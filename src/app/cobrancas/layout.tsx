import type { Metadata } from "next";

// A página é um componente de cliente, por isso o título do separador vem daqui.
export const metadata: Metadata = { title: "Cobranças" };

export default function CollectionsLayout({
  children,
}: LayoutProps<"/cobrancas">) {
  return children;
}
