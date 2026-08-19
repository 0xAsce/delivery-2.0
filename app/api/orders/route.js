import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function POST(request) {
  const customer = await getCustomer();

  if (!customer) {
    return NextResponse.json(
      { error: "Login required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!Array.isArray(body?.items) || !body.items.length) {
      return NextResponse.json(
        { error: "items are required" },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     * Never trust shopId sent by the browser.
     * The customer's main seller is stored on their account.
     */
    if (!customer.mainStoreId) {
      return NextResponse.json(
        {
          error:
            "Please select your main seller before placing an order.",
        },
        { status: 400 }
      );
    }

    const shopId = customer.mainStoreId;

    const store = await db.store.findFirst({
      where: {
        id: shopId,
        status: "OPEN",
        user: {
          role: "SELLER",
          wilaya: customer.wilaya,
          city: customer.city,
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        {
          error:
            "Your main seller is no longer available in your area.",
        },
        { status: 400 }
      );
    }

    const requestedItems = body.items.map((item) => ({
      productId: item.id ? String(item.id) : null,
      quantity: Math.max(
        1,
        Number(item.qty || item.quantity) || 0
      ),
    }));

    if (
      requestedItems.some(
        (item) => !item.productId || item.quantity < 1
      )
    ) {
      return NextResponse.json(
        { error: "Invalid order items" },
        { status: 400 }
      );
    }

    const productIds = requestedItems.map(
      (item) => item.productId
    );

    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        storeId: shopId,
        isHidden: false,
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more products are no longer available from this store.",
        },
        { status: 400 }
      );
    }

    const productMap = new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );

    const items = requestedItems.map((requested) => {
      const product = productMap.get(
        requested.productId
      );

      const price = Number(
        product.discountPrice ??
          product.sellingPrice
      );

      return {
        productId: product.id,
        name: product.name,
        unit: null,
        price,
        quantity: requested.quantity,
      };
    });

    const total = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await db.customerOrder.create({
      data: {
        customerId: customer.id,
        shopId,
        total,

        note: body.note
          ? String(body.note).slice(0, 1000)
          : null,

        wilaya: customer.wilaya,
        city: customer.city,
        address: customer.address,

        deliveryMethod: body.deliveryMethod
          ? String(body.deliveryMethod)
          : null,

        items: {
          create: items,
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { order },
      { status: 201 }
    );
  } catch (error) {
    console.error("customer order", error);

    return NextResponse.json(
      {
        error: "Unable to place order",
      },
      { status: 500 }
    );
  }
}