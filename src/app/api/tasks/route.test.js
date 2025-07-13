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
    task: {
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

describe("POST /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task when valid and authorized", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    prisma.project.findFirst.mockResolvedValue({ id: "project-1" });
    prisma.task.aggregate.mockResolvedValue({ _max: { order: 2 } });

    const mockTask = {
      id: "task-1",
      title: "New Task",
      order: 3,
    };
    prisma.task.create.mockResolvedValue(mockTask);

    const mockRequest = {
      json: async () => ({
        projectId: "project-1",
        columnId: "column-1",
        title: "New Task",
        description: "Details",
        dueDate: "2025-08-01",
        priority: "HIGH",
        assigneeId: "user-2",
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockTask);
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: "New Task",
        description: "Details",
        dueDate: "2025-08-01",
        priority: "HIGH",
        assigneeId: "user-2",
        projectId: "project-1",
        columnId: "column-1",
        order: 3,
      },
    });
  });

  it("should return 400 if required fields are missing", async () => {
    getSessionUser.mockResolvedValue(mockUser);

    const mockRequest = {
      json: async () => ({
        title: "Missing fields",
      }),
    };

    const response = await POST(mockRequest);
    const text = await response.text();

    expect(response.status).toBe(400);
    expect(text).toBe("Missing required fields");
  });

  it("should return 403 if user lacks access", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.findFirst.mockResolvedValue(null);

    const mockRequest = {
      json: async () => ({
        projectId: "project-1",
        columnId: "column-1",
        title: "No Access Task",
      }),
    };

    const response = await POST(mockRequest);
    const text = await response.text();

    expect(response.status).toBe(403);
    expect(text).toBe("Unauthorized");
  });
});
