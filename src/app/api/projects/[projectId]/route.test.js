/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "./route";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    project: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      createMany: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

const mockUser = { id: "user-1", email: "test@example.com" };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/projects/:id", () => {
  it("returns 200 and project data if user has access", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue({ id: "project-1" });
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      name: "Test Project",
    });

    const res = await GET({}, { params: { projectId: "project-1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.name).toBe("Test Project");
  });

  it("returns 403 if user has no access", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue(null);

    const res = await GET({}, { params: { projectId: "project-1" } });

    expect(res.status).toBe(403);
  });
});

describe("PATCH /api/projects/:id", () => {
  it("updates project name/desc, adds members and returns 200", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue({
      id: "project-1",
      members: [],
    });

    const mockReq = {
      json: async () => ({
        name: "Updated Name",
        description: "Updated Desc",
        addMembers: [{ userId: "user-2", role: "PM" }],
      }),
    };

    const res = await PATCH(mockReq, { params: { projectId: "project-1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(prisma.project.update).toHaveBeenCalled();
    expect(prisma.projectMember.createMany).toHaveBeenCalled();
  });

  it("returns 400 if user tries to remove self", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue({
      id: "project-1",
      members: [{ userId: mockUser.id }],
    });

    const mockReq = {
      json: async () => ({
        removeMembers: [mockUser.id],
      }),
    };

    const res = await PATCH(mockReq, { params: { projectId: "project-1" } });
    const text = await res.text();

    expect(res.status).toBe(400);
    expect(text).toMatch(/PMs cannot remove themselves/);
  });

  it("returns 403 if project not found or unauthorized", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue(null);

    const mockReq = {
      json: async () => ({}),
    };

    const res = await PATCH(mockReq, { params: { projectId: "invalid" } });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/projects/:id", () => {
  it("deletes project if user is owner", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      ownerId: mockUser.id,
    });

    const res = await DELETE({}, { params: { projectId: "project-1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(prisma.project.delete).toHaveBeenCalled();
  });

  it("returns 403 if not owner", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findUnique.mockResolvedValue({
      id: "project-1",
      ownerId: "another-user",
    });

    const res = await DELETE({}, { params: { projectId: "project-1" } });

    expect(res.status).toBe(403);
  });
});
