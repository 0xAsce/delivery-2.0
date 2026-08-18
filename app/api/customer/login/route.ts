import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createCustomerSession } from "@/lib/customer-auth";
import { normalizeAlgerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeAlgerianPhone(body.phone);
    const password = String(body.password || "");
    if (!phone || !password) return NextResponse.json({ error: "Phone and password are required." }, { status: 400 });

    const user = await db.user.findUnique({ where: { phone } });
    if (!user || user.role !== "CUSTOMER" || !user.password || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "Invalid phone number or password." }, { status: 401 });
    }
    await createCustomerSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone, wilaya: user.wilaya, city: user.city, address: user.address, phoneVerified: !!user.phoneVerifiedAt } });
  } catch (error) {
    console.error("customer login", error);
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}