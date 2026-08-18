import { NextResponse } from "next/server";
import { destroySellerSession } from "@/lib/seller-auth";

export async function POST() {
  await destroySellerSession();
  return NextResponse.json({ ok: true });
}
