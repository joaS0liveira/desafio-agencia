import type { Metadata } from "next";

// A página é um componente de cliente, por isso o título do separador vem daqui.
// O detalhe (/clientes/[id]) troca-o pelo nome da empresa.
export const metadata: Metadata = { title: "Clientes" };

export default function ClientsLayout({ children }: LayoutProps<"/clientes">) {
  return children;
}
