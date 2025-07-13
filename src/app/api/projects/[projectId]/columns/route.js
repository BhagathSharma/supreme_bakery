import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const user = await getSessionUser();
  const { projectId } = await params;
  const { title } = await req.json();

  if (!title) return new NextResponse("Title required", { status: 400 });

  const access = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    select: { id: true },
  });

  if (!access) return new NextResponse("Unauthorized", { status: 403 });

  const maxOrder = await prisma.column.aggregate({
    where: { projectId },
    _max: { order: true },
  });

  const newColumn = await prisma.column.create({
    data: {
      title,
      order: (maxOrder._max.order ?? 0) + 1,
      projectId,
    },
  });

  return NextResponse.json(newColumn);
}
