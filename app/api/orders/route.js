import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function POST(request) {
  const customer = await getCustomer();
  if (!customer) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const body = await request.json();
    if (!Array.isArray(body?.items) || !body.items.length) {
      return NextResponse.json({ error: "items are required" }, { status: 400 });
    }
    const items = body.items.map((item) => ({
      productId: item.id ? String(item.id) : null,
      name: String(item.name || "").trim(),
      unit: item.unit ? String(item.unit) : null,
      price: Number(item.price),
      quantity: Math.max(1, Number(item.qty || item.quantity) || 0),
    }));
    if (items.some((x) => !x.name || !Number.isFinite(x.price) || x.price < 0 || x.quantity < 1)) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await db.customerOrder.create({
      data: {
        customerId: customer.id,
        shopId: body.shopId ? String(body.shopId) : null,
        total,
        note: body.note ? String(body.note).slice(0, 1000) : null,
        wilaya: customer.wilaya,
        city: customer.city,
        address: customer.address,
        items: { create: items },
      },
      include: { items: true },
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("customer order", error);
    return NextResponse.json({ error: "Unable to place order" }, { status: 500 });
  }
}
