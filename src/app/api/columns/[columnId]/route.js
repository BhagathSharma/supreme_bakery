import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  const { columnId } = await params;
  const { title, order } = await req.json();

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: {
      project: {
        select: {
          id: true,
          ownerId: true,
          members: {
            where: { role: "PM", userId: user.id },
          },
        },
      },
    },
  });

  if (
    !column ||
    (column.project.ownerId !== user.id && column.project.members.length === 0)
  ) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const updated = await prisma.column.update({
    where: { id: columnId },
    data: {
      title,
      order,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  const { columnId } = params;

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: {
      project: {
        select: {
          id: true,
          ownerId: true,
          members: {
            where: { role: "PM", userId: user.id },
          },
        },
      },
    },
  });

  if (
    !column ||
    (column.project.ownerId !== user.id && column.project.members.length === 0)
  ) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  await prisma.column.delete({
    where: { id: columnId },
  });

  return NextResponse.json({ success: true });
}
