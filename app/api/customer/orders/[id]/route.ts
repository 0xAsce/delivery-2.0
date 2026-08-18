import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await db.customerOrder.findFirst({
      where: {
        id,
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET customer order error:", error);

    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const note =
      typeof body.note === "string"
        ? body.note.trim()
        : "";

    const existingOrder = await db.customerOrder.findFirst({
      where: {
        id,
        customerId: customer.id,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Don't allow changing the note after the order
    // has already been processed.
    if (
      existingOrder.status !== "PENDING" &&
      existingOrder.status !== "CONFIRMED"
    ) {
      return NextResponse.json(
        {
          error:
            "This order can no longer be modified.",
        },
        { status: 400 }
      );
    }

    const order = await db.customerOrder.update({
      where: {
        id,
      },
      data: {
        note: note || null,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("PATCH customer order error:", error);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await db.customerOrder.findFirst({
      where: {
        id,
        customerId: customer.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow deleting pending orders.
    if (order.status !== "PENDING") {
      return NextResponse.json(
        {
          error:
            "Only pending orders can be deleted.",
        },
        { status: 400 }
      );
    }

    await db.customerOrder.delete({
      where: {
        id: order.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE customer order error:", error);

    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}