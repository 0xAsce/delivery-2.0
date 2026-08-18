import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const amount = Number(body?.amount);
  if (!body?.shopId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "shopId and positive amount are required" }, { status: 400 });
  }
  return NextResponse.json({
    transaction: {
      id: "TX-" + Date.now().toString().slice(-8),
      shopId: body.shopId,
      type: "payment",
      amount: -amount,
      note: body.note || "",
      createdAt: Date.now()
    }
  }, { status: 201 });
}