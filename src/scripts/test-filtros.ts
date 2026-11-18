import clientes from "@/data/clientes.json"
import encomendas from "@/data/encomendas.json"
import { Client, Order } from "@/types";
import { filterClients, filterOrders, uniqueValues, emptyOrderFilters} from "@/lib/filtros";

// ----------- RESUMO CLINTE ------------------- ///

// 1. Converter os JSONs para os tipos definidos
const clients = clientes as Client[];
const orders = encomendas as Order[];

console.log(`Carregados ${clientes.length} clientes e ${encomendas.length} encomendas.\n`);

// 2. Verificar valores únicos disponíveis nos seus JSONs (útil para saber o que testar)
const cidades = uniqueValues(clients, (c) => c.city);
const setores = uniqueValues(clients, (c) => c.sector);
const servicos = uniqueValues(orders, (o) => o.service);

console.log("=== OPÇÕES DISPONÍVEIS ===");
console.log("Cidades:", cidades);
console.log("Setores:", setores);
console.log("Serviços:", servicos);

// 3. Testar filtro de clientes usando a primeira cidade disponível no JSON
console.log("\n=== TESTE: filterClients ===");
const resultadoClientes = filterClients(clients, {
  search: "", // Experimente escrever parte do nome de uma empresa do seu JSON
  sector: null,
  city: cidades[0] ?? null, // Filtra automaticamente pela primeira cidade encontrada
});
console.log(`Encontrados ${resultadoClientes.length} clientes em ${cidades[0]}:`);
console.table(resultadoClientes.slice(0, 5)); // Mostra apenas os primeiros 5 para não encher o terminal

// 4. Testar filtro de encomendas usando o primeiro serviço disponível
console.log("\n=== TESTE: filterOrders ===");
const resultadoEncomendas = filterOrders(orders, clients, {
  ...emptyOrderFilters,
  service: servicos[0] ?? null,
  period: { from: "2025-01-01", to: "2026-12-31" },
});
console.log(`Encontradas ${resultadoEncomendas.length} encomendas de "${servicos[0]}":`);
console.table(resultadoEncomendas.slice(0, 5));
