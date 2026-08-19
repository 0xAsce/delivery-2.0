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
        { error: "Customer location is not set." },
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
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        address: true,
        phone: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    let mainStore = null;

    if (customer.mainStoreId) {
      mainStore = await db.store.findFirst({
        where: {
          id: customer.mainStoreId,
          status: "OPEN",
          user: {
            role: "SELLER",
            wilaya: customer.wilaya,
            city: customer.city,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          banner: true,
          address: true,
          phone: true,
          status: true,
        },
      });
    }

    return NextResponse.json({
      mainStore,
      stores,
      location: {
        wilaya: customer.wilaya,
        city: customer.city,
      },
    });
  } catch (error) {
    console.error("main seller GET", error);

    return NextResponse.json(
      { error: "Unable to load sellers." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const storeId = String(body.storeId || "").trim();

    if (!storeId) {
      return NextResponse.json(
        { error: "Please select a seller." },
        { status: 400 }
      );
    }

    if (!customer.wilaya || !customer.city) {
      return NextResponse.json(
        { error: "Customer location is not set." },
        { status: 400 }
      );
    }

    const store = await db.store.findFirst({
      where: {
        id: storeId,
        status: "OPEN",
        user: {
          role: "SELLER",
          wilaya: customer.wilaya,
          city: customer.city,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        address: true,
        phone: true,
        status: true,
      },
    });

    if (!store) {
      return NextResponse.json(
        {
          error:
            "This seller is not available in your area.",
        },
        { status: 404 }
      );
    }

    await db.user.update({
      where: {
        id: customer.id,
      },
      data: {
        mainStoreId: store.id,
      },
    });

    return NextResponse.json({
      ok: true,
      store,
    });
  } catch (error) {
    console.error("main seller POST", error);

    return NextResponse.json(
      { error: "Unable to select seller." },
      { status: 500 }
    );
  }
}