import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { isValidWilaya } from "@/lib/wilayas";

export async function PATCH(req: Request) {
  const user = await getCustomer();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const wilaya = String(body.wilaya || "").trim();
    const city = String(body.city || "").trim();
    const address = String(body.address || "").trim() || null;
    if (name.length > 100 || !isValidWilaya(wilaya) || city.length < 2 || city.length > 100 || address && address.length > 300) {
      return NextResponse.json({ error: "Invalid profile information." }, { status: 400 });
    }
    const updated = await db.user.update({ where: { id: user.id }, data: { name: name || null, wilaya, city, address } });
    return NextResponse.json({ ok: true, user: { id: updated.id, name: updated.name, phone: updated.phone, wilaya: updated.wilaya, city: updated.city, address: updated.address, phoneVerified: !!updated.phoneVerifiedAt } });
  } catch (error) {
    console.error("customer profile", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}