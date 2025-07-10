import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteColumn(_, projectId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ columnId }) => {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to delete column");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Column deleted");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete column");
    },
  });
}
