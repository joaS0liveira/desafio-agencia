"use client";

import { useMemo } from "react";
import { emailLink, phoneLink } from "../lib/actions.ts";
import {
  clientSummary,
  missingServices,
  ordersForClient,
} from "../lib/clients.ts";
import { orderMonths } from "../lib/dates.ts";
import { uniqueValues } from "../lib/filters.ts";
import { revenueByMonth, revenueByService } from "../lib/stats.ts";
import { clients, orders } from "../services/data.ts";

export function useClient(id: number | string, recentLimit = 6) {
  return useMemo(() => {
    const client = clients.find((client) => client.id === Number(id));
    if (!client) return { notFound: true as const, client: null };

    const clientOrders = ordersForClient(orders, client.id);
    const services = revenueByService(clientOrders);
    const missing = missingServices(
      clientOrders,
      uniqueValues(orders, (order) => order.service),
    );
    return {
      notFound: false as const,
      client,
      summary: clientSummary(clientOrders, orders),
      monthlyRevenue: revenueByMonth(clientOrders, orderMonths(orders)),
      services,
      missingServices: missing,
      opportunity: missing.length ? `Sugerir ${missing.join(", ")}.` : null,
      recentOrders: clientOrders
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .slice(0, recentLimit),
      emailHref: emailLink(client.email),
      phoneHref: phoneLink(client.phone),
    };
  }, [id, recentLimit]);
}
