import type { Metadata } from "next";
import { Suspense } from "react";
import { DetalheCliente } from "@/components/clientes/DetalheCliente";
import { ACarregar } from "@/components/ui/EstadoVazio";
import clientes from "../../../../public/data/clientes.json";

// Os ids são conhecidos à partida: cada página de cliente é gerada no build.
export function generateStaticParams() {
  return clientes.map((cliente) => ({ id: String(cliente.id) }));
}

// O separador mostra o nome da empresa (ex.: "Vale Verde Agro · jrl.labs")
export async function generateMetadata({
  params,
}: PageProps<"/clientes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const cliente = clientes.find((c) => String(c.id) === id);
  return { title: cliente ? cliente.company : "Cliente não encontrado" };
}

async function Conteudo({
  params,
}: Pick<PageProps<"/clientes/[id]">, "params">) {
  const { id } = await params;
  return <DetalheCliente id={id} />;
}

// O Suspense deixa a navegação ser instantânea enquanto o id é lido.
export default function ClientePage({ params }: PageProps<"/clientes/[id]">) {
  return (
    <Suspense fallback={<ACarregar />}>
      <Conteudo params={params} />
    </Suspense>
  );
}
