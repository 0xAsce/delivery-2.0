import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function POST(req: Request) {
  const user = await getCustomer();
  if (!user || !user.phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { code } = await req.json();
    const token = String(code || "").trim();
    const record = await db.verificationToken.findFirst({ where: { identifier: `customer-phone:${user.id}`, token } });
    if (!record || record.expires < new Date()) return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { phoneVerifiedAt: new Date() } }),
      db.verificationToken.delete({ where: { token: record.token } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to verify phone." }, { status: 500 });
  }
}