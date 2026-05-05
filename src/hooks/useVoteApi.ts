import { useSnackbarContext } from "@/contexts/snackbar.context";
import { ERROR_MESSAGES } from "@/lib/messages";
import { Question } from "@/types/question";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserId } from "./useCurrentUserId";

export const useSubmitVote = () => {
  type MutationProps = {
    targetId: number;
    targetType: "question" | "answer";
    type: "upvote" | "downvote";
  };
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async ({ targetId, targetType, type }: MutationProps) => {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          targetId: targetId,
          targetType: targetType,
          type,
        }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.VOTES.SUBMIT);
      }

      return { targetId, targetType, type };
    },
    onSuccess: ({ targetId, type }) => {
      const voteValue = type === "upvote" ? 1 : -1;

      queryClient.setQueriesData<Question[]>({ queryKey: ["questions"] }, (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((question) => {
          if (question.id !== targetId) return question;

          const prevVote =
            question.viewerVoteValue === 1
              ? "upvote"
              : question.viewerVoteValue === -1
                ? "downvote"
                : null;

          let newScore = question.voteScore;
          let newVote: 1 | -1 | undefined = undefined;

          if (prevVote === type) {
            newScore += voteValue * -1;
            newVote = undefined;
          } else if (prevVote === null) {
            newScore += voteValue;
            newVote = voteValue as 1 | -1;
          } else {
            newScore += voteValue * 2;
            newVote = voteValue as 1 | -1;
          }

          return {
            ...question,
            voteScore: newScore,
            viewerVoteValue: newVote,
          };
        });
      });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.VOTES.SUBMIT, "danger");
    },
  });
};
