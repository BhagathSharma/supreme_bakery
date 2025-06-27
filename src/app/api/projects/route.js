import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSessionUser();

  const projects = await prisma.project.findMany({
    where: {
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    include: {
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });

  return NextResponse.json(projects);
}

export async function POST(req) {
  const user = await getSessionUser();
  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description ?? "",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "PM",
        },
      },
    },
  });

  return NextResponse.json(project);
}
