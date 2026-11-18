import clientes from "@/data/clientes.json"

import { filtrarPorCliente } from "@/lib/filtros"
import { Client } from "@/types";

const client: Client[] = clientes as Client[];

// ----------- RESUMO CLINTE ------------------- ///

const empresa = "Atlas Clínicas";
const companyFiltered = filtrarPorCliente(client, empresa);

console.log(companyFiltered)