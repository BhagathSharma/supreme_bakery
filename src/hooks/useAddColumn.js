import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddColumn(projectId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`/api/projects/${projectId}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to add column");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Column added");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add column");
    },
  });
}
