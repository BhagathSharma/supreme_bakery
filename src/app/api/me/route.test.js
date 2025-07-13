/**
 * @jest-environment node
 */
import { GET } from "./route";
import { getSessionUser } from "@/getSessionUser";

jest.mock("@/getSessionUser", () => ({
  __esModule: true,
  getSessionUser: jest.fn(),
}));

describe("GET /api/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user if authenticated", async () => {
    const mockUser = { id: "user-1", email: "test@example.com" };
    getSessionUser.mockResolvedValue(mockUser);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockUser);
    expect(getSessionUser).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if not authenticated", async () => {
    getSessionUser.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });
});
