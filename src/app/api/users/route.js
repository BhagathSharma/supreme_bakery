import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

export async function GET(req) {
  const user = await getSessionUser();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
      NOT: { id: user.id },
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return NextResponse.json(users);
}
