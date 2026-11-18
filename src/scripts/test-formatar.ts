import { formatEuro, formatK, formatPercent, initials  } from "@/lib/formatar";

import clientes from "@/data/clientes.json"
import encomendas from "@/data/encomendas.json"
import { Client, Order } from "@/types";

const client: Client[] = clientes as Client[];
const order: Order[] = encomendas as Order[];

for (const c of client) {
    console.log(initials(c.company))
}

console.log(formatEuro(order[0].amount))

let a = 125125

console.log(formatK(a))

