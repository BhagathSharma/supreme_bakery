/**
 * @jest-environment node
 */
import { PATCH, DELETE } from "./route";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    task: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

const mockUser = { id: "user-1", email: "user@example.com" };

describe("PATCH /api/tasks/:taskId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSessionUser.mockResolvedValue(mockUser);
  });

  it("should return 404 if task is not found", async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    const req = { json: async () => ({ title: "Updated" }) };
    const res = await PATCH(req, { params: { taskId: "task-1" } });
    expect(res.status).toBe(404);
  });

  it("should return 403 if user is not owner or member", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      projectId: "project-1",
      project: { ownerId: "someone-else" },
    });
    prisma.projectMember.findFirst.mockResolvedValue(null);

    const req = { json: async () => ({ title: "Updated" }) };
    const res = await PATCH(req, { params: { taskId: "task-1" } });
    expect(res.status).toBe(403);
  });

  it("should return 400 if assigneeId is invalid", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      projectId: "project-1",
      project: { ownerId: "owner-id" },
    });
    prisma.projectMember.findFirst.mockResolvedValueOnce(true); // current user is member
    prisma.projectMember.findFirst.mockResolvedValueOnce(null); // assignee is not member

    const req = {
      json: async () => ({
        title: "Updated",
        assigneeId: "not-a-member",
      }),
    };

    const res = await PATCH(req, { params: { taskId: "task-1" } });
    expect(res.status).toBe(400);
  });

  it("should update task when authorized and assignee valid", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      projectId: "project-1",
      project: { ownerId: mockUser.id },
    });

    prisma.projectMember.findFirst.mockResolvedValue(true); // skip for owner
    const mockUpdate = { id: "task-1", title: "Updated" };
    prisma.task.update.mockResolvedValue(mockUpdate);

    const req = {
      json: async () => ({
        title: "Updated",
        assigneeId: "user-1", // valid
      }),
    };

    const res = await PATCH(req, { params: { taskId: "task-1" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Updated");
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { title: "Updated", assigneeId: "user-1" },
    });
  });
});

describe("DELETE /api/tasks/:taskId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSessionUser.mockResolvedValue(mockUser);
  });

  it("should return 404 if task not found", async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    const req = {};
    const res = await DELETE(req, { params: { taskId: "task-1" } });
    expect(res.status).toBe(404);
  });

  it("should return 403 if user not owner or member", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      projectId: "project-1",
      project: { ownerId: "someone-else" },
    });
    prisma.projectMember.findFirst.mockResolvedValue(null);

    const res = await DELETE({}, { params: { taskId: "task-1" } });
    expect(res.status).toBe(403);
  });

  it("should delete task if authorized", async () => {
    prisma.task.findUnique.mockResolvedValue({
      id: "task-1",
      projectId: "project-1",
      project: { ownerId: mockUser.id },
    });
    prisma.projectMember.findFirst.mockResolvedValue(true);
    prisma.task.delete.mockResolvedValue({ id: "task-1" });

    const res = await DELETE({}, { params: { taskId: "task-1" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
  });
});
