import { useSnackbarContext } from "@/contexts/snackbar.context";
import { ERROR_MESSAGES } from "@/lib/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserId } from "./useCurrentUserId";

export const useFollow = (targetUserId: number) => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: targetUserId,
        }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.FOLLOWS.FOLLOW);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", targetUserId, currentUserId] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.FOLLOWS.FOLLOW, "danger");
    },
  });
};

export const useUnfollow = (targetUserId: number) => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      params.set("followerId", String(currentUserId));
      params.set("followingId", String(targetUserId));

      const res = await fetch(`/api/follows?${params}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.FOLLOWS.UNFOLLOW);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", targetUserId, currentUserId] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.FOLLOWS.UNFOLLOW, "danger");
    },
  });
};
