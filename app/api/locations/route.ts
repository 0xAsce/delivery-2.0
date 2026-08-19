import { NextResponse } from "next/server";
import {
  getBaladias,
  getWilayas,
} from "@/lib/locations";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const wilaya =
      searchParams.get("wilaya");

    if (wilaya) {
      return NextResponse.json({
        wilaya,
        baladias:
          getBaladias(wilaya),
      });
    }

    return NextResponse.json({
      wilayas: getWilayas(),
    });
  } catch (error) {
    console.error(
      "locations API",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load locations.",
      },
      { status: 500 }
    );
  }
}