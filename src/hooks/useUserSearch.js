
import { useQuery } from "@tanstack/react-query";

export function useUserSearch(query) {
  return useQuery({
    queryKey: ["user-search", query],
    queryFn: async () => {
      const res = await fetch(`/api/users?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search users");
      return res.json();
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}
