import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

export async function POST() {
  const user = await getSeller();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
  return NextResponse.json({ ok: true });
}
