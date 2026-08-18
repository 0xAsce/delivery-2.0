import { NextResponse } from "next/server";
import { getCustomer } from "@/lib/customer-auth";

export async function GET() {
  const user = await getCustomer();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user: { id: user.id, name: user.name, phone: user.phone, wilaya: user.wilaya, city: user.city, address: user.address, phoneVerified: !!user.phoneVerifiedAt } });
}