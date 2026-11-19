"use client";

import { useFilteredOrders } from "@/hooks/useFilteredOrders";
import { useFilters } from "@/hooks/useFilters";

export default function DashboardPage() {
    // 1. Liga aos controlos de filtro e opções dos selects
    const { filters, setFilter, resetFilters, hasActiveFilters, options } =
        useFilters();

    // 2. Liga aos dados já filtrados e aos totais calculados
    const { orders, totals, count, isEmpty, loading } = useFilteredOrders();

    // Mostra estado inicial enquanto o fetch aos JSON não termina
    if (loading) {
        return <div className="p-8">A carregar dados...</div>;
    }

    return (
        <main className="p-8 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Painel de Encomendas</h1>

            {/* SECÇÃO 1: Barra de Filtros */}
            <section className="flex flex-wrap gap-4 items-center p-4 rounded-lg">
                {/* Pesquisa por texto */}
                <input
                    type="text"
                    placeholder="Pesquisar empresa..."
                    value={filters.search}
                    onChange={(e) => setFilter("search", e.target.value)}
                    className="border p-2 rounded bg-black"
                />

                {/* Filtro de Setor */}
                <select
                    value={filters.sector ?? ""}
                    onChange={(e) => setFilter("sector", e.target.value || null)}
                    className="border p-2 rounded"
                >
                    <option value="">Todos os setores</option>
                    {options.sectors.map((sector) => (
                        <option key={sector} value={sector}>
                            {sector}
                        </option>
                    ))}
                </select>

                {/* Filtro de Serviço */}
                <select
                    value={filters.service ?? ""}
                    onChange={(e) => setFilter("service", e.target.value || null)}
                    className="border p-2 rounded bg-black"
                >
                    <option value="">Todos os serviços</option>
                    {options.services.map((service) => (
                        <option key={service} value={service}>
                            {service}
                        </option>
                    ))}
                </select>

                {/* Botão para limpar filtros (só aparece se houver filtros ativos) */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-sm text-red-600 underline cursor-pointer"
                    >
                        Limpar filtros
                    </button>
                )}
            </section>

            {/* SECÇÃO 2: Cartões de Totais */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Encomendas Encontradas</p>
                    <p className="text-2xl font-bold">{count}</p>
                </div>

                <div className="border p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Receita Total</p>
                    {/* Ajuste "totals.revenue" conforme o nome da propriedade devolvida pela sua função totals() */}
                    <p className="text-2xl font-bold">{totals.billed} €</p>
                </div>
            </section>

            {/* SECÇÃO 3: Lista / Tabela de Resultados */}
            <section>
                {isEmpty ? (
                    <p className="text-gray-500 py-8 text-center">
                        Nenhuma encomenda corresponde aos filtros selecionados.
                    </p>
                ) : (
                    <table className="w-full border-collapse border text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 text-black">ID</th>
                                <th className="p-3 text-black">Data</th>
                                <th className="p-3 text-black">Serviço</th>
                                <th className="p-3 text-black">Estado</th>
                                <th className="p-3 text-black text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-800">
                                    <td className="p-3">#{order.id}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3">{order.service}</td>
                                    <td className="p-3">{order.status}</td>
                                    <td className="p-3 text-right">{order.amount} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}
