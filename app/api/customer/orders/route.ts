import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function GET() {
  const customer = await getCustomer();

  if (!customer) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await db.customerOrder.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function DELETE(request: Request) {
  const customer = await getCustomer();

  if (!customer) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const orderId = String(body?.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Make sure this order belongs to the logged-in customer
    const order = await db.customerOrder.findFirst({
      where: {
        id: orderId,
        customerId: customer.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Only pending orders can be cancelled
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "هذا الطلب لم يعد قابلاً للإلغاء" },
        { status: 409 }
      );
    }

    const cancelled = await db.customerOrder.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      order: cancelled,
    });
  } catch (error) {
    console.error("cancel customer order", error);

    return NextResponse.json(
      { error: "Unable to cancel order" },
      { status: 500 }
    );
  }
}