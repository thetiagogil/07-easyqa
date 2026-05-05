import { useSnackbarContext } from "@/contexts/snackbar.context";
import { MAIN_PAGE_QUESTIONS_SIZE, QUESTION_PAGE_ANSWERS_SIZE } from "@/lib/constants";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/messages";
import { SortType } from "@/types";
import { Question } from "@/types/question";
import { usePrivy } from "@privy-io/react-auth";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentUserId } from "./useCurrentUserId";

export const useGetQuestions = (sort: SortType = "new", enabled: boolean = true) => {
  const currentUserId = useCurrentUserId();
  const { ready } = usePrivy();

  return useInfiniteQuery({
    queryKey: ["questions", sort, currentUserId],
    enabled: enabled && ready,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("limit", String(MAIN_PAGE_QUESTIONS_SIZE));
      params.set("offset", String(pageParam * MAIN_PAGE_QUESTIONS_SIZE));
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.PLURAL);
      }

      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === MAIN_PAGE_QUESTIONS_SIZE ? allPages.length : undefined,
  });
};

export const useGetQuestionById = (id: number, enabled = true) => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();
  const { ready } = usePrivy();

  const query = useQuery({
    queryKey: ["question", id, currentUserId],
    enabled: enabled && ready && !!id,
    queryFn: async (): Promise<Question> => {
      const params = new URLSearchParams();
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions/${id}?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.SINGULAR);
      }

      return await res.json();
    },
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.FETCH.SINGULAR, "danger");
    }
  }, [query.isError, showSnackbar]);

  return query;
};

export const useGetQuestionAnswers = (questionId: number) => {
  const currentUserId = useCurrentUserId();

  return useInfiniteQuery({
    queryKey: ["questionAnswers", questionId, currentUserId],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("limit", String(QUESTION_PAGE_ANSWERS_SIZE));
      params.set("offset", String(pageParam * QUESTION_PAGE_ANSWERS_SIZE));
      if (currentUserId) params.set("viewerId", String(currentUserId));

      const res = await fetch(`/api/questions/${questionId}/answers?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.FETCH.ANSWERS);
      }

      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === QUESTION_PAGE_ANSWERS_SIZE ? allPages.length : undefined,
  });
};

export const useCreateQuestion = () => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async (data: Partial<Question>) => {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.QUESTIONS.CREATE);
      }

      return await res.json();
    },
    onSuccess: () => {
      showSnackbar(SUCCESS_MESSAGES.QUESTIONS.CREATE, "success");
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.QUESTIONS.CREATE, "danger");
    },
  });
};
