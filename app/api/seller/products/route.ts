import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || `product-${Date.now()}`;
  let slug = base;
  let counter = 2;

  while (
    await db.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}

function jsonProduct(product: any) {
  return {
    ...product,
    costPrice: Number(product.costPrice),
    sellingPrice: Number(product.sellingPrice),
    discountPrice:
      product.discountPrice == null ? null : Number(product.discountPrice),
    variants: product.variants?.map((variant: any) => ({
      ...variant,
      costPrice: variant.costPrice == null ? null : Number(variant.costPrice),
      sellingPrice:
        variant.sellingPrice == null ? null : Number(variant.sellingPrice),
      discountPrice:
        variant.discountPrice == null ? null : Number(variant.discountPrice),
      weight: variant.weight == null ? null : Number(variant.weight),
    })),
  };
}

export async function GET() {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    where: { storeId: seller.store.id },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    products: products.map(jsonProduct),
    categories,
  });
}

export async function POST(request: Request) {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const sellingPrice = Number(body?.sellingPrice);
    if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
      return NextResponse.json({ error: "Invalid selling price" }, { status: 400 });
    }

    const costPrice = Number(body?.costPrice ?? 0);
    const discountPrice =
      body?.discountPrice === "" || body?.discountPrice == null
        ? null
        : Number(body.discountPrice);

    if (!Number.isFinite(costPrice) || costPrice < 0) {
      return NextResponse.json({ error: "Invalid cost price" }, { status: 400 });
    }

    if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0)) {
      return NextResponse.json({ error: "Invalid discount price" }, { status: 400 });
    }

    let categoryId = body?.categoryId ? String(body.categoryId) : "";

    if (categoryId) {
      const category = await db.category.findUnique({
        where: { id: categoryId },
        select: { id: true, isActive: true },
      });

      if (!category?.isActive) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
    } else {
      const categoryName = String(body?.categoryName ?? "عام").trim() || "عام";
      const categorySlugBase = slugify(categoryName) || `category-${Date.now()}`;

      let category = await db.category.findFirst({
        where: { name: categoryName },
        select: { id: true },
      });

      if (!category) {
        let slug = categorySlugBase;
        let n = 2;

        while (await db.category.findUnique({ where: { slug }, select: { id: true } })) {
          slug = `${categorySlugBase}-${n++}`;
        }

        category = await db.category.create({
          data: { name: categoryName, slug },
          select: { id: true },
        });
      }

      categoryId = category.id;
    }

    const slug = await uniqueSlug(name);

    const stockQuantity = Math.max(0, Math.floor(Number(body?.stockQuantity ?? 0)));
    const lowStockAlert = Math.max(0, Math.floor(Number(body?.lowStockAlert ?? 5)));

    const sku =
      String(body?.sku ?? "").trim() ||
      `${seller.store.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: body?.description ? String(body.description) : null,
        storeId: seller.store.id,
        categoryId,
        costPrice,
        sellingPrice,
        discountPrice,
        isHidden: Boolean(body?.isHidden),
        isFeatured: Boolean(body?.isFeatured),
        images: body?.imageUrl
          ? {
              create: {
                url: String(body.imageUrl),
                isPrimary: true,
                position: 0,
              },
            }
          : undefined,
        variants: {
          create: {
            sku,
            barcode: body?.barcode ? String(body.barcode) : null,
            sellingPrice,
            costPrice,
            discountPrice,
            stockQuantity,
            lowStockAlert,
          },
        },
      },
      include: {
        category: true,
        images: { orderBy: { position: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({ product: jsonProduct(product) }, { status: 201 });
  } catch (error: any) {
    console.error("seller products POST", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create product" },
      { status: 500 }
    );
  }
}
