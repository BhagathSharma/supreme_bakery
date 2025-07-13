/**
 * @jest-environment node
 */
import { GET } from "./route";
import { prisma } from "@/prisma";

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("GET /api/users/[userId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if userId is missing", async () => {
    const req = {};
    const res = await GET(req, { params: {} });
    const body = await res.text();

    expect(res.status).toBe(400);
    expect(body).toBe("Missing userId");
  });

  it("should return 404 if user not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = {};
    const res = await GET(req, { params: { userId: "not-exist" } });
    const body = await res.text();

    expect(res.status).toBe(404);
    expect(body).toBe("User not found");
  });

  it("should return user info if found", async () => {
    const mockUser = {
      id: "u123",
      name: "Alice",
      email: "alice@example.com",
      image: "https://example.com/img.jpg",
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);

    const req = {};
    const res = await GET(req, { params: { userId: "u123" } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "u123" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  });
});
