import assert from "node:assert/strict";
import clientsData from "../../public/data/clientes.json" with { type: "json" };
import ordersData from "../../public/data/encomendas.json" with {
  type: "json",
};
import {
  daysBetween,
  latestDate,
  monthKey,
  monthLabel,
  orderMonths,
  parseDate,
} from "../lib/dates.ts";
import {
  emptyOrderFilters,
  filterClients,
  filterOrders,
  hasActiveFilters,
  uniqueValues,
} from "../lib/filters.ts";

import type { Client, Order } from "../types/index.ts";

const clients = clientsData as Client[];
const orders = ordersData as Order[];

const order = orders[0];
const client = clients.find((client) => client.id === order.client_id);
assert.ok(client);
const services = uniqueValues(orders, (order) => order.service);
const cities = uniqueValues(clients, (client) => client.city);
console.log("Services", services, "Cities", cities);
const query = client.company
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toUpperCase();
const matchingClients = filterClients(clients, {
  search: query,
  city: client.city,
  sector: client.sector,
});
console.table(matchingClients.map(({ id, company }) => ({ id, company })));
assert.ok(matchingClients.includes(client));

const filters = {
  search: query,
  sector: client.sector,
  service: order.service,
  status: order.status,
  period: { from: order.date, to: order.date },
};
assert.equal(hasActiveFilters(emptyOrderFilters), false);
assert.equal(hasActiveFilters(filters), true);
const matchingOrders = filterOrders(orders, clients, filters);
assert.deepEqual(
  matchingOrders,
  orders.filter(
    (item) =>
      item.client_id === client.id &&
      item.date === order.date &&
      item.service === order.service &&
      item.status === order.status,
  ),
);
assert.equal(
  filterOrders(orders, clients, emptyOrderFilters).length,
  orders.length,
);

const months = orderMonths(orders);
console.log(
  "Dataset period",
  monthLabel(months[0]),
  monthLabel(months[months.length - 1]),
  latestDate(orders),
);
assert.equal(latestDate([]), null);
assert.deepEqual(orderMonths([]), []);
assert.deepEqual(
  orderMonths([
    { ...order, date: "2026-01-03" },
    { ...order, date: "2025-11-30" },
  ]),
  ["2025-11", "2025-12", "2026-01"],
);
assert.equal(
  monthKey(order.date),
  parseDate(order.date).toISOString().slice(0, 7),
);
assert.equal(daysBetween("2024-03-30", "2024-04-01"), 2);
