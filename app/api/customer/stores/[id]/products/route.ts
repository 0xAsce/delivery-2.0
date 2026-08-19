import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const store = await db.store.findFirst({
      where: {
        id,
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
  phone: true,

  user: {
    select: {
      name: true,
      wilaya: true,
      city: true,
    },
  },

  products: {
    where: {
      isHidden: false,
    },
    include: {
      images: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
},,
    });

    if (!store) {
      return NextResponse.json(
        {
          error:
            "Store not found or unavailable in your area.",
        },
        { status: 404 }
      );
    }

    const products = store.products.map((product) => {
      const sellingPrice = Number(
        product.discountPrice ??
          product.sellingPrice
      );

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: sellingPrice,
        originalPrice:
          product.discountPrice !== null
            ? Number(product.sellingPrice)
            : null,
        category: product.categoryId,
        image:
          product.images?.[0]?.url || null,
      };
    });

    return NextResponse.json({
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        banner: store.banner,
        phone: store.phone,
        wilaya: store.user?.wilaya,
        city: store.user?.city,
        ownerName: store.user?.name,
      },

      products,
    });
  } catch (error) {
    console.error(
      "customer store products",
      error
    );

    return NextResponse.json(
      { error: "Unable to load store products." },
      { status: 500 }
    );
  }
}