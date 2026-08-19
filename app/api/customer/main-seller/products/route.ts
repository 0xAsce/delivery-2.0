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

    if (!customer.mainStoreId) {
      return NextResponse.json({
        hasSeller: false,
        store: null,
        products: [],
      });
    }

    const store = await db.store.findFirst({
      where: {
        id: customer.mainStoreId,
        status: "OPEN",
        user: {
          role: "SELLER",
          wilaya: customer.wilaya || undefined,
          city: customer.city || undefined,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
      },
    });

    if (!store) {
      return NextResponse.json({
        hasSeller: false,
        store: null,
        products: [],
      });
    }

    const products = await db.product.findMany({
      where: {
        storeId: store.id,
        isHidden: false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
      },
      orderBy: [
        {
          isFeatured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      hasSeller: true,
      store,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        unit: null,
        price: Number(
          product.discountPrice ??
            product.sellingPrice
        ),
        sellingPrice: Number(
          product.sellingPrice
        ),
        discountPrice:
          product.discountPrice !== null
            ? Number(product.discountPrice)
            : null,
        category: product.category.slug,
        categoryName: product.category.name,
        image:
          product.images[0]?.url || null,
        stock: true,
      })),
    });
  } catch (error) {
    console.error(
      "main seller products",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load your seller products.",
      },
      { status: 500 }
    );
  }
}