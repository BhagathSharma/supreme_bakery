import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await getSessionUser();
  const body = await req.json();

  const {
    projectId,
    columnId,
    title,
    description,
    dueDate,
    priority,
    assigneeId,
  } = body;

  if (!projectId || !columnId || !title) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const hasAccess = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    select: { id: true },
  });

  if (!hasAccess) return new NextResponse("Unauthorized", { status: 403 });

  const maxOrder = await prisma.task.aggregate({
    where: { columnId },
    _max: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate,
      priority,
      assigneeId,
      projectId,
      columnId,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(task);
}
