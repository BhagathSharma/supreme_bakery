import { useQuery } from "@tanstack/react-query";

export function useUserById(userId) {
  return useQuery({
    queryKey: ["user-by-id", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
