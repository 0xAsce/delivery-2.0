import { NextResponse } from "next/server";
import { DEFAULT_CATALOG } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ products: DEFAULT_CATALOG });
}

export async function POST(request) {
  const body = await request.json();
  if (!body?.name || body?.price == null) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 });
  }
  return NextResponse.json({
    product: {
      id: "p-" + Date.now(),
      name: String(body.name),
      unit: String(body.unit || "unité"),
      price: Number(body.price),
      category: body.category || "boissons",
      stock: body.stock !== false,
      lowStock: body.lowStock === true,
      image: body.image || "",
      emoji: body.emoji || "🛒"
    }
  }, { status: 201 });
}