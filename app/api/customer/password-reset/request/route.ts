import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { normalizeAlgerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeAlgerianPhone(body.phone);
    if (!phone) return NextResponse.json({ error: "Invalid Algerian phone number." }, { status: 400 });
    const user = await db.user.findUnique({ where: { phone } });
    const response: { ok: true; devCode?: string } = { ok: true };
    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json(response);
    }
    const code = String(randomInt(100000, 1000000));
    await db.verificationToken.deleteMany({ where: { identifier: `customer-reset:${phone}` } });
    await db.verificationToken.create({ data: { identifier: `customer-reset:${phone}`, token: code, expires: new Date(Date.now() + 10 * 60000) } });
    if (process.env.NODE_ENV !== "production") response.devCode = code;
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Unable to request password reset." }, { status: 500 });
  }
}