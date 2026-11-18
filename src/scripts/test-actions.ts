import assert from "node:assert/strict";
import {
  collectionEmailLink,
  emailLink,
  phoneLink,
  toCsv,
} from "../lib/actions.ts";
import {
  formatDate,
  formatEuro,
  formatPercent,
  formatThousands,
  initials,
} from "../lib/format.ts";
import clientsData  from "../../public/data/clientes.json";
import ordersData from "../../public/data/encomendas.json";

import { Client, Order, ORDER_STATUS } from "../types/index.ts";

const clients = clientsData as Client[];
const orders = ordersData as Order[];

const order = orders.find((order) => order.status === ORDER_STATUS.overdue);
assert.ok(order);
const client = clients.find((client) => client.id === order.client_id);
assert.ok(client);

console.log(
  client.company,
  initials(client.company),
  formatDate(order.date),
  formatEuro(order.amount),
);
console.log(
  "Rounded amounts",
  formatThousands(order.amount),
  formatPercent(0.125),
);
assert.equal(initials("  Vale  Verde Agro "), "VV");
assert.equal(formatPercent(0.125), "13%");
assert.equal(formatThousands(125125), "125k");
assert.equal(emailLink(client.email), `mailto:${client.email}`);
assert.equal(
  emailLink(client.email, "A & B"),
  `mailto:${client.email}?subject=A%20%26%20B`,
);
const reminder = new URL(collectionEmailLink(client, order));
console.log(reminder.searchParams.get("subject"), phoneLink(client.phone));
assert.equal(reminder.pathname, client.email);
assert.ok(reminder.searchParams.get("body")?.includes(formatDate(order.date)));
assert.equal(phoneLink("+351 230 519 584"), phoneLink("230 519 584"));

const columns: [keyof typeof client, string][] = [
  ["company", "Empresa"],
  ["city", "Cidade"],
];
console.log(toCsv(clients.slice(0, 2), columns));
assert.equal(
  toCsv(
    [{ text: 'a;"b"\nc', amount: null }],
    [
      ["text", "A;B"],
      ["amount", "C"],
    ],
  ),
  '"A;B";C\r\n"a;""b""\nc";',
);
