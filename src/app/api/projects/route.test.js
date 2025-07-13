/**
 * @jest-environment node
 */

import { POST } from "./route.js";
import { prisma } from "@/prisma";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    project: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

const mockUser = { id: "user-1", email: "test@example.com" };

describe("POST /api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a project and assign current user as PM", async () => {
    getSessionUser.mockResolvedValue(mockUser);
    prisma.project.create.mockResolvedValue({
      id: "project-1",
      name: "Test Project",
      description: "This is a test project",
      ownerId: mockUser.id,
    });

    const mockRequest = {
      json: async () => ({
        name: "Test Project",
        description: "This is a test project",
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Test Project");
    expect(data.ownerId).toBe(mockUser.id);

    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        name: "Test Project",
        description: "This is a test project",
        ownerId: mockUser.id,
        members: {
          create: {
            userId: mockUser.id,
            role: "PM",
          },
        },
      },
    });
  });
});
