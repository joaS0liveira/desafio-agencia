import assert from "node:assert/strict";
import clientsData from "../../public/data/clientes.json" with { type: "json" };
import ordersData from "../../public/data/encomendas.json" with {
  type: "json",
};
import { EMAIL_SIGNATURE, toCsv } from "../lib/actions.ts";
import { collectionRows, collectionSummary } from "../lib/collections.ts";
import {
  ageBuckets,
  debtorEmailLink,
  debtorsByClient,
  openTone,
  sortByPriority,
} from "../lib/debtors.ts";
import { monthsInPeriod, periodGroups } from "../lib/periods.ts";
import { type Client, ORDER_STATUS, type Order } from "../types/index.ts";

const clients = clientsData as Client[];
const orders = ordersData as Order[];
const rows = collectionRows(orders, clients);
const summary = collectionSummary(orders);

// Cobranças: as faixas e os devedores somam exatamente o total em aberto (sem perder cêntimos)
const buckets = ageBuckets(rows);
assert.equal(
  buckets.reduce((sum, b) => sum + b.amount, 0),
  summary.totalOpen,
);
assert.equal(
  buckets.reduce((sum, b) => sum + b.count, 0),
  rows.length,
);
assert.ok(Math.abs(buckets.reduce((sum, b) => sum + b.share, 0) - 1) < 1e-9);

const debtors = debtorsByClient(rows);
assert.equal(
  debtors.reduce((sum, d) => sum + d.total, 0),
  summary.totalOpen,
);
assert.equal(
  debtors.reduce((sum, d) => sum + d.overdue, 0),
  summary.overdue.amount,
);
assert.equal(debtors.length, summary.clientsWithOpenOrders);
// Quem tem mais em atraso aparece primeiro
for (let i = 1; i < debtors.length; i++) {
  assert.ok(debtors[i - 1].overdue >= debtors[i].overdue);
}

// Prioridade: atrasos antes de pendentes
const sorted = sortByPriority(rows);
const firstPending = sorted.findIndex(
  (r) => r.order.status !== ORDER_STATUS.overdue,
);
assert.ok(
  sorted
    .slice(firstPending)
    .every((r) => r.order.status !== ORDER_STATUS.overdue),
);

// Regra única da cor de "Em aberto"
assert.equal(openTone(10, 0), "danger");
assert.equal(openTone(0, 10), "warning");
assert.equal(openTone(0, 0), "normal");

// O email agrupado leva a assinatura comum
assert.ok(
  decodeURIComponent(debtorEmailLink(debtors[0])).includes(EMAIL_SIGNATURE),
);

// CSV: texto que parece fórmula fica neutralizado; números negativos não
assert.equal(
  toCsv(
    [{ a: "=HYPERLINK(1)", b: -5 }],
    [
      ["a", "A"],
      ["b", "B"],
    ],
  ),
  "A;B\r\n'=HYPERLINK(1);-5",
);

// Períodos: "Todo o período" vem primeiro e um mês só inclui esse mês
const groups = periodGroups(orders);
assert.equal(groups[0].options[0].value, null);
const month = groups.find((g) => g.label === "Meses")?.options[0];
assert.ok(month?.value);
const months = [...new Set(orders.map((o) => o.date.slice(0, 7)))].sort();
assert.deepEqual(monthsInPeriod(months, month.value), [month.key]);
assert.deepEqual(monthsInPeriod(months, null), months);

console.log("test-debtors: ok");
