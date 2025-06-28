import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const user = await getSessionUser();
  const { projectId } = await params;

  const access = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
    },
    select: { id: true },
  });

  if (!access) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      columns: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              assignee: {
                select: { id: true, name: true, email: true, image: true },
              },
              Comment: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(project);
}
export async function PATCH(req, { params }) {
  const user = await getSessionUser();
  const { projectId } = params;
  const body = await req.json();

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id, role: "PM" } } },
      ],
    },
    select: {
      id: true,
      members: { select: { userId: true } },
    },
  });

  if (!project) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  // Prevent PM from changing/removing their own role
  if (Array.isArray(body.updateMembers)) {
    const tryingToModifySelf = body.updateMembers.some(
      (m) => m.userId === user.id
    );
    if (tryingToModifySelf) {
      return new NextResponse("PMs cannot change their own role", {
        status: 400,
      });
    }
  }

  if (Array.isArray(body.removeMembers)) {
    const tryingToRemoveSelf = body.removeMembers.includes(user.id);
    if (tryingToRemoveSelf) {
      return new NextResponse("PMs cannot remove themselves", { status: 400 });
    }
  }

  // Update name/description
  const updateData = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;

  await prisma.project.update({
    where: { id: projectId },
    data: updateData,
  });

  // Add members if not already present
  if (Array.isArray(body.addMembers)) {
    const existingIds = new Set(project.members.map((m) => m.userId));
    const newMembers = body.addMembers.filter(
      (m) => !existingIds.has(m.userId)
    );

    if (newMembers.length > 0) {
      await prisma.projectMember.createMany({
        data: newMembers.map((m) => ({
          userId: m.userId,
          projectId,
          role: m.role ?? "CONTRIBUTOR",
        })),
        skipDuplicates: true,
      });
    }
  }

  // Update roles (excluding self already handled above)
  if (Array.isArray(body.updateMembers)) {
    for (const { userId, role } of body.updateMembers) {
      await prisma.projectMember.update({
        where: {
          userId_projectId: { userId, projectId },
        },
        data: { role },
      });
    }
  }

  // Remove members (excluding self already handled above)
  if (Array.isArray(body.removeMembers)) {
    await prisma.projectMember.deleteMany({
      where: {
        projectId,
        userId: { in: body.removeMembers },
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  const projectId = params.projectId;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.ownerId !== user.id) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ success: true });
}
