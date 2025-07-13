/**
 * @jest-environment node
 */
import { GET } from "./route";
import { getSessionUser } from "@/getSessionUser";
import { prisma } from "@/prisma";

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

jest.mock("@/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

const mockUser = { id: "user-1", email: "user@example.com" };

describe("GET /api/search-users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSessionUser.mockResolvedValue(mockUser);
  });

  it("should return empty array if query is missing", async () => {
    const req = { url: "http://localhost/api/search-users" };
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });

  it("should return empty array if query is too short", async () => {
    const req = { url: "http://localhost/api/search-users?query=a" };
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([]);
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });

  it("should return matched users when query is valid", async () => {
    const mockResults = [
      { id: "u2", name: "Alice", email: "alice@example.com", image: null },
      { id: "u3", name: "Bob", email: "bob@example.com", image: null },
    ];

    prisma.user.findMany.mockResolvedValue(mockResults);

    const req = { url: "http://localhost/api/search-users?query=ali" };
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockResults);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: { contains: "ali", mode: "insensitive" } },
          { name: { contains: "ali", mode: "insensitive" } },
        ],
        NOT: { id: mockUser.id },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  });
});
