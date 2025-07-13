/**
 * @jest-environment node
 */

import { PATCH, DELETE } from "./route";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    column: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

const mockUser = { id: "user-1", email: "test@example.com" };
const columnId = "col-123";
const mockColumn = {
  id: columnId,
  title: "Initial",
  order: 1,
  project: {
    id: "proj-1",
    ownerId: "user-1",
    members: [],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  getSessionUser.mockResolvedValue(mockUser);
});

describe("PATCH /api/columns/:columnId", () => {
  it("should update column if user is owner", async () => {
    prisma.column.findUnique.mockResolvedValue(mockColumn);
    prisma.column.update.mockResolvedValue({
      ...mockColumn,
      title: "Updated",
      order: 2,
    });

    const req = {
      json: async () => ({ title: "Updated", order: 2 }),
    };

    const res = await PATCH(req, { params: { columnId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.title).toBe("Updated");
    expect(prisma.column.update).toHaveBeenCalledWith({
      where: { id: columnId },
      data: { title: "Updated", order: 2 },
    });
  });

  it("should reject if user is unauthorized", async () => {
    prisma.column.findUnique.mockResolvedValue({
      ...mockColumn,
      project: { ...mockColumn.project, ownerId: "someone-else", members: [] },
    });

    const req = {
      json: async () => ({ title: "Should Not Update", order: 99 }),
    };

    const res = await PATCH(req, { params: { columnId } });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe("Unauthorized");
    expect(prisma.column.update).not.toHaveBeenCalled();
  });

  it("should reject if column is not found", async () => {
    prisma.column.findUnique.mockResolvedValue(null);

    const req = {
      json: async () => ({ title: "Nothing", order: 1 }),
    };

    const res = await PATCH(req, { params: { columnId } });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe("Unauthorized");
  });
});

describe("DELETE /api/columns/:columnId", () => {
  it("should delete column if user is owner", async () => {
    prisma.column.findUnique.mockResolvedValue(mockColumn);
    prisma.column.delete.mockResolvedValue({});

    const req = {};

    const res = await DELETE(req, { params: { columnId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(prisma.column.delete).toHaveBeenCalledWith({
      where: { id: columnId },
    });
  });

  it("should reject delete if user is unauthorized", async () => {
    prisma.column.findUnique.mockResolvedValue({
      ...mockColumn,
      project: { ...mockColumn.project, ownerId: "not-user", members: [] },
    });

    const req = {};

    const res = await DELETE(req, { params: { columnId } });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe("Unauthorized");
    expect(prisma.column.delete).not.toHaveBeenCalled();
  });

  it("should reject delete if column is not found", async () => {
    prisma.column.findUnique.mockResolvedValue(null);

    const req = {};

    const res = await DELETE(req, { params: { columnId } });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe("Unauthorized");
  });
});
