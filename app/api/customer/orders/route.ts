import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function GET() {
  const customer = await getCustomer();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await db.customerOrder.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
