import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch current user");
      return res.json();
    },
  });
}
