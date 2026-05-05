import { useSnackbarContext } from "@/contexts/snackbar.context";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/messages";
import { Answer } from "@/types/answer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserId } from "./useCurrentUserId";

export const useCreateAnswer = (questionId: number) => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async (data: Partial<Answer>) => {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, questionId, userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.ANSWERS.CREATE);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar(SUCCESS_MESSAGES.ANSWERS.CREATE, "success");
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.ANSWERS.CREATE, "danger");
    },
  });
};

export const useAcceptAnswer = (questionId: number) => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  if (!currentUserId) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
  }

  return useMutation({
    mutationFn: async (answerId: number) => {
      const res = await fetch(`/api/answers/${answerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.ANSWERS.ACCEPT);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar(SUCCESS_MESSAGES.ANSWERS.ACCEPT, "success");
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.ANSWERS.ACCEPT, "danger");
    },
  });
};
