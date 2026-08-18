import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function GET() {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!customer.wilaya || !customer.city) {
      return NextResponse.json(
        { error: "Customer location is not set" },
        { status: 400 }
      );
    }

    const stores = await db.store.findMany({
      where: {
        status: "OPEN",
        user: {
          role: "SELLER",
          wilaya: customer.wilaya,
          city: customer.city,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            wilaya: true,
            city: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      stores,
      location: {
        wilaya: customer.wilaya,
        city: customer.city,
      },
    });
  } catch (error) {
    console.error("customer stores", error);

    return NextResponse.json(
      { error: "Unable to load stores" },
      { status: 500 }
    );
  }
}