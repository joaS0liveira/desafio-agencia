"use client";

import { useMemo } from "react";
import { emailLink, phoneLink } from "../lib/actions";
import {
  clientSummary,
  missingServices,
  ordersForClient,
} from "../lib/clients";
import { orderMonths } from "../lib/dates";
import { uniqueValues } from "../lib/filters";
import { revenueByMonth, revenueByService } from "../lib/stats";
import { useAppData } from "./useAppData";

export function useClient(id: number | string, recentLimit = 6) {
  const { clients, orders, loading } = useAppData();

  return useMemo(() => {
    if (loading) {
      return { loading: true as const, notFound: false as const, client: null };
    }

    const client = clients.find((c) => c.id === Number(id));
    if (!client) {
      return { loading: false as const, notFound: true as const, client: null };
    }

    const clientOrders = ordersForClient(orders, client.id);
    const services = revenueByService(clientOrders);
    const missing = missingServices(
      clientOrders,
      uniqueValues(orders, (order) => order.service)
    );

    return {
      loading: false as const,
      notFound: false as const,
      client,
      summary: clientSummary(clientOrders, orders),
      monthlyRevenue: revenueByMonth(clientOrders, orderMonths(orders)),
      services,
      missingServices: missing,
      opportunity: missing.length ? `Sugerir ${missing.join(", ")}.` : null,
      recentOrders: [...clientOrders]
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .slice(0, recentLimit),
      emailHref: emailLink(client.email),
      phoneHref: phoneLink(client.phone),
    };
  }, [id, recentLimit, clients, orders, loading]);
}

