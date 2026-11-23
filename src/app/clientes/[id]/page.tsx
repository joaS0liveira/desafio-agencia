import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientDetail } from "@/components/clients/ClientDetail";
import { PageSkeleton } from "@/components/ui/EmptyState";
import clientList from "../../../../public/data/clientes.json";

// Os ids são conhecidos à partida: cada página de cliente é gerada no build.
export function generateStaticParams() {
  return clientList.map((client) => ({ id: String(client.id) }));
}

// O separador mostra o nome da empresa (ex.: "Vale Verde Agro · jrl.fin")
export async function generateMetadata({
  params,
}: PageProps<"/clientes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const client = clientList.find((c) => String(c.id) === id);
  return { title: client ? client.company : "Cliente não encontrado" };
}

async function Content({
  params,
}: Pick<PageProps<"/clientes/[id]">, "params">) {
  const { id } = await params;
  return <ClientDetail id={id} />;
}

// O Suspense deixa a navegação ser instantânea enquanto o id é lido.
export default function ClientPage({ params }: PageProps<"/clientes/[id]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
