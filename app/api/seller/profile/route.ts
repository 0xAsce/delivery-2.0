import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

const statuses = new Set(["OPEN", "BUSY", "CLOSED", "VACATION"]);

export async function PATCH(req: Request) {
  const user = await getSeller();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    const fields = ["name","description","logo","banner","address","latitude","longitude","phone","email","deliveryRadius","openingHours","taxInformation","status"];
    for (const field of fields) if (body[field] !== undefined) data[field] = body[field];

    if (data.status !== undefined && !statuses.has(String(data.status))) {
      return NextResponse.json({ error: "Invalid store status." }, { status: 400 });
    }
    if (data.name !== undefined && !String(data.name).trim()) {
      return NextResponse.json({ error: "Store name is required." }, { status: 400 });
    }
    for (const field of ["logo","banner"]) {
      if (data[field] && String(data[field]).startsWith("data:") && String(data[field]).length > 2_000_000) {
        return NextResponse.json({ error: `${field} image is too large.` }, { status: 400 });
      }
    }

    const store = await db.store.update({ where: { id: user.store.id }, data: data as never });
    return NextResponse.json({ ok: true, store });
  } catch (error) {
    console.error("seller profile update", error);
    return NextResponse.json({ error: "Unable to update store profile." }, { status: 500 });
  }
}
