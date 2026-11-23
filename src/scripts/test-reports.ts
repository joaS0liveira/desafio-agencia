import assert from "node:assert/strict";
import clientsData from "../../public/data/clientes.json" with { type: "json" };
import ordersData from "../../public/data/encomendas.json" with {
  type: "json",
};
import {
  clientSummary,
  inactiveClients,
  indexClients,
  missingServices,
  ordersForClient,
  topClients,
  topShare,
} from "../lib/clients.ts";
import {
  collectionRows,
  collectionSummary,
  filterCollections,
  openOrders,
  sortCollections,
} from "../lib/collections.ts";
import {
  averageTicketByService,
  monthOverMonth,
  revenueByKey,
  revenueByMonth,
  revenueByService,
  sumOrderAmounts,
  totals,
} from "../lib/stats.ts";
import { type Client, ORDER_STATUS, type Order } from "../types/index.ts";

const clients = clientsData as Client[];
const orders = ordersData as Order[];

const report = totals(orders);
const summary = collectionSummary(orders);
const outstanding = openOrders(orders);
const rows = collectionRows(orders, clients);
console.table({ ...report });
console.log("Collections", summary);
assert.equal(report.billed, sumOrderAmounts(orders));
assert.equal(report.received + report.open, report.billed);
assert.equal(summary.totalOpen, sumOrderAmounts(outstanding));
assert.equal(rows.length, summary.overdue.count + summary.pending.count);
assert.equal(totals([]).collectionRate, 0);
for (const sort of ["amount", "days", "date", "client"] as const) {
  console.log(
    "First collection by",
    sort,
    sortCollections(rows, sort)[0]?.order.id,
  );
}
assert.deepEqual(
  rows.map((row) => row.order),
  outstanding,
);
assert.deepEqual(filterCollections(rows, "Todos"), rows);
const filtered = filterCollections(
  rows,
  ORDER_STATUS.overdue,
  rows[0].order.service,
);
assert.deepEqual(
  filtered,
  rows.filter(
    ({ order }) =>
      order.status === ORDER_STATUS.overdue &&
      order.service === rows[0].order.service,
  ),
);

const monthly = revenueByMonth(orders);
const services = revenueByService(orders);
console.table(monthOverMonth(monthly));
console.table(averageTicketByService(orders));
assert.equal(
  services.reduce((sum, entry) => sum + entry.revenue, 0),
  report.billed,
);
assert.equal(
  monthly.reduce((sum, entry) => sum + entry.revenue, 0),
  report.billed,
);
assert.equal(revenueByMonth([], ["2026-01"])[0].revenue, 0);
assert.equal(
  monthOverMonth([
    { month: "2026-01", revenue: 0 },
    { month: "2026-02", revenue: 10 },
  ])[1].change,
  null,
);

const ranking = topClients(orders, clients);
const client = ranking[0].client;
const clientOrders = ordersForClient(orders, client.id);
const clientReport = clientSummary(clientOrders, orders);
assert.equal(indexClients(clients).get(client.id), client);
assert.equal(
  revenueByKey(orders, (order) => order.client_id).get(client.id),
  clientReport.billed,
);
assert.equal(clientReport.billed, ranking[0].revenue);
assert.equal(topShare(orders, clients, 1), ranking[0].share);
console.log("Top client", client.company, clientReport);
console.log(
  "Missing services",
  missingServices(
    clientOrders,
    services.map((entry) => entry.service),
  ),
);
console.log(
  "Inactive clients",
  inactiveClients(clients, orders).map((entry) => entry.client.company),
);
assert.equal(clientSummary([], orders).daysSinceLastOrder, null);
assert.deepEqual(inactiveClients([client], [], 0, client.customer_since), []);
assert.equal(
  inactiveClients([client], [], -1, client.customer_since)[0].lastOrderDate,
  null,
);
