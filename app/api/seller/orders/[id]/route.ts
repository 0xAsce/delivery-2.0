import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const VALID_PAYMENT_STATUSES = [
  "UNPAID",
  "PAID",
  "REFUNDED",
] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await db.customerOrder.findFirst({
    where: { id, shopId: seller.store.id },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db.customerOrder.findFirst({
      where: { id, shopId: seller.store.id },
      select: { id: true, status: true, paymentStatus: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();
    const data: any = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.paymentStatus !== undefined) {
      if (!VALID_PAYMENT_STATUSES.includes(body.paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      data.paymentStatus = body.paymentStatus;
    }

    if (body.note !== undefined) {
      data.note = body.note ? String(body.note).slice(0, 1000) : null;
    }

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const order = await db.customerOrder.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            wilaya: true,
            city: true,
            address: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json({
      order: {
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      },
    });
  } catch (error) {
    console.error("seller order PATCH", error);
    return NextResponse.json({ error: "Unable to update order" }, { status: 500 });
  }
}
