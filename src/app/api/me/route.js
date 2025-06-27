import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}
