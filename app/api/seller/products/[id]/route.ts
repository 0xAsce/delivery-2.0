import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

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
    const existing = await db.product.findFirst({
      where: { id, storeId: seller.store.id },
      include: { variants: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();

    const data: any = {};

    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.description !== undefined) data.description = body.description || null;
    if (body.categoryId !== undefined) data.categoryId = String(body.categoryId);
    if (body.sellingPrice !== undefined) data.sellingPrice = Number(body.sellingPrice);
    if (body.costPrice !== undefined) data.costPrice = Number(body.costPrice);
    if (body.discountPrice !== undefined) {
      data.discountPrice =
        body.discountPrice === "" || body.discountPrice == null
          ? null
          : Number(body.discountPrice);
    }
    if (body.isHidden !== undefined) data.isHidden = Boolean(body.isHidden);
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);

    if (data.name === "") {
      return NextResponse.json({ error: "Product name cannot be empty" }, { status: 400 });
    }

    if (data.sellingPrice !== undefined && (!Number.isFinite(data.sellingPrice) || data.sellingPrice < 0)) {
      return NextResponse.json({ error: "Invalid selling price" }, { status: 400 });
    }

    if (data.costPrice !== undefined && (!Number.isFinite(data.costPrice) || data.costPrice < 0)) {
      return NextResponse.json({ error: "Invalid cost price" }, { status: 400 });
    }

    if (
      data.discountPrice !== undefined &&
      data.discountPrice !== null &&
      (!Number.isFinite(data.discountPrice) || data.discountPrice < 0)
    ) {
      return NextResponse.json({ error: "Invalid discount price" }, { status: 400 });
    }

    const variant = existing.variants[0];

    const updated = await db.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data,
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
          variants: true,
        },
      });

      if (variant) {
        const variantData: any = {};

        if (body.sku !== undefined) variantData.sku = String(body.sku).trim();
        if (body.barcode !== undefined) {
          variantData.barcode = body.barcode ? String(body.barcode).trim() : null;
        }
        if (body.stockQuantity !== undefined) {
          const quantity = Math.max(0, Math.floor(Number(body.stockQuantity)));
          if (!Number.isFinite(quantity)) throw new Error("Invalid stock quantity");
          variantData.stockQuantity = quantity;
        }
        if (body.lowStockAlert !== undefined) {
          const alert = Math.max(0, Math.floor(Number(body.lowStockAlert)));
          if (!Number.isFinite(alert)) throw new Error("Invalid low-stock threshold");
          variantData.lowStockAlert = alert;
        }
        if (data.sellingPrice !== undefined) variantData.sellingPrice = data.sellingPrice;
        if (data.costPrice !== undefined) variantData.costPrice = data.costPrice;
        if (data.discountPrice !== undefined) variantData.discountPrice = data.discountPrice;

        if (Object.keys(variantData).length) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: variantData,
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
          variants: true,
        },
      });
    });

    return NextResponse.json({
      product: {
        ...updated,
        costPrice: Number(updated.costPrice),
        sellingPrice: Number(updated.sellingPrice),
        discountPrice:
          updated.discountPrice == null ? null : Number(updated.discountPrice),
        variants: updated.variants.map((v) => ({
          ...v,
          costPrice: v.costPrice == null ? null : Number(v.costPrice),
          sellingPrice: v.sellingPrice == null ? null : Number(v.sellingPrice),
          discountPrice: v.discountPrice == null ? null : Number(v.discountPrice),
          weight: v.weight == null ? null : Number(v.weight),
        })),
      },
    });
  } catch (error: any) {
    console.error("seller products PATCH", error);
    return NextResponse.json(
      { error: error?.message || "Unable to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const seller = await getSeller();

  if (!seller?.store) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await db.product.findFirst({
      where: { id, storeId: seller.store.id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Keep historical order items intact. "Delete" from the seller
    // dashboard means hide/deactivate the product.
    await db.product.update({
      where: { id },
      data: { isHidden: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("seller products DELETE", error);
    return NextResponse.json({ error: "Unable to delete product" }, { status: 500 });
  }
}
