import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateColumn(_, projectId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ columnId, ...payload }) => {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to update column");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Column updated");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update column");
    },
  });
}
