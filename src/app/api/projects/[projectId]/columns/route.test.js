/**
 * @jest-environment node
 */

import { POST } from "./route";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    project: {
      findFirst: jest.fn(),
    },
    column: {
      aggregate: jest.fn(),
      create: jest.fn(),
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

describe("POST /api/columns", () => {
  it("returns 400 if title is missing", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    const mockReq = {
      json: async () => ({}),
    };

    const res = await POST(mockReq, { params: { projectId: "project-1" } });
    const text = await res.text();

    expect(res.status).toBe(400);
    expect(text).toBe("Title required");
  });

  it("returns 403 if user has no access to project", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    prisma.project.findFirst.mockResolvedValue(null); // No access

    const mockReq = {
      json: async () => ({ title: "New Column" }),
    };

    const res = await POST(mockReq, { params: { projectId: "project-1" } });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe("Unauthorized");
  });

  it("creates a new column with correct order", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    prisma.project.findFirst.mockResolvedValue({ id: "project-1" });
    prisma.column.aggregate.mockResolvedValue({ _max: { order: 2 } });
    prisma.column.create.mockResolvedValue({
      id: "column-1",
      title: "New Column",
      order: 3,
      projectId: "project-1",
    });

    const mockReq = {
      json: async () => ({ title: "New Column" }),
    };

    const res = await POST(mockReq, { params: { projectId: "project-1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.title).toBe("New Column");
    expect(json.order).toBe(3);
    expect(prisma.column.create).toHaveBeenCalledWith({
      data: {
        title: "New Column",
        order: 3,
        projectId: "project-1",
      },
    });
  });

  it("defaults order to 1 if no columns exist", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    prisma.project.findFirst.mockResolvedValue({ id: "project-1" });
    prisma.column.aggregate.mockResolvedValue({ _max: { order: null } });
    prisma.column.create.mockResolvedValue({
      id: "column-1",
      title: "First Column",
      order: 1,
      projectId: "project-1",
    });

    const mockReq = {
      json: async () => ({ title: "First Column" }),
    };

    const res = await POST(mockReq, { params: { projectId: "project-1" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.order).toBe(1);
  });
});
