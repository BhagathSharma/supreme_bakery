import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  const { taskId } = params;
  const body = await req.json();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) return new NextResponse("Task not found", { status: 404 });

  const isOwner = task.project.ownerId === user.id;
  const isMember = await prisma.projectMember.findFirst({
    where: { projectId: task.projectId, userId: user.id },
  });

  if (!isOwner && !isMember) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  if (body.assigneeId) {
    const isValidAssignee =
      body.assigneeId === task.project.ownerId ||
      (await prisma.projectMember.findFirst({
        where: { projectId: task.projectId, userId: body.assigneeId },
      }));

    if (!isValidAssignee) {
      return new NextResponse("Invalid assigneeId — not a project member", {
        status: 400,
      });
    }
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  const { taskId } = params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) return new NextResponse("Task not found", { status: 404 });

  const isOwner = task.project.ownerId === user.id;
  const isMember = await prisma.projectMember.findFirst({
    where: { projectId: task.projectId, userId: user.id },
  });

  if (!isOwner && !isMember) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  await prisma.task.delete({ where: { id: taskId } });

  return NextResponse.json({ success: true });
}
