import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = seller.store.id;
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  const start7 = new Date(startToday);
  start7.setDate(start7.getDate() - 6);

  const [todayOrders, pendingOrders, recentOrders, products, recentCustomers] =
    await Promise.all([
      db.customerOrder.count({
        where: { shopId: storeId, createdAt: { gte: startToday } },
      }),
      db.customerOrder.count({
        where: { shopId: storeId, status: "PENDING" },
      }),
      db.customerOrder.findMany({
        where: {
          shopId: storeId,
          createdAt: { gte: start7 },
          status: { not: "CANCELLED" },
        },
        select: {
          total: true,
          createdAt: true,
          items: {
            select: {
              productId: true,
              name: true,
              quantity: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      db.product.findMany({
        where: { storeId },
        include: {
          variants: {
            select: { stockQuantity: true, lowStockAlert: true },
          },
        },
      }),
      db.customerOrder.findMany({
        where: { shopId: storeId },
        select: { customerId: true },
        distinct: ["customerId"],
      }),
    ]);

  const revenue = recentOrders
    .filter((order) => dayKey(order.createdAt) === dayKey(now))
    .reduce((sum, order) => sum + Number(order.total), 0);

  const salesByDay = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const date = new Date(start7);
    date.setDate(start7.getDate() + i);
    salesByDay.set(dayKey(date), 0);
  }

  for (const order of recentOrders) {
    const key = dayKey(order.createdAt);
    if (salesByDay.has(key)) {
      salesByDay.set(key, (salesByDay.get(key) ?? 0) + Number(order.total));
    }
  }

  const bestMap = new Map<string, { name: string; sold: number }>();

  for (const order of recentOrders) {
    for (const item of order.items) {
      const key = item.productId ?? item.name;
      const current = bestMap.get(key);
      bestMap.set(key, {
        name: item.name,
        sold: (current?.sold ?? 0) + item.quantity,
      });
    }
  }

  const lowStockProducts = products
    .map((product) => {
      const stock = product.variants.length
        ? Math.min(...product.variants.map((variant) => variant.stockQuantity))
        : 0;

      const threshold = product.variants.length
        ? Math.max(...product.variants.map((variant) => variant.lowStockAlert))
        : 0;

      return {
        id: product.id,
        name: product.name,
        stock,
        lowStock: stock <= threshold,
      };
    })
    .filter((product) => product.lowStock)
    .sort((a, b) => a.stock - b.stock);

  return NextResponse.json({
    todayOrders,
    revenue,
    pendingOrders,
    newCustomers: recentCustomers.length,
    sales: Array.from(salesByDay.entries()).map(([date, value]) => ({
      date,
      value,
    })),
    bestSellingProducts: Array.from(bestMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5),
    lowStockProducts: lowStockProducts.slice(0, 10),
  });
}
