import { useSnackbarContext } from "@/contexts/snackbar.context";
import { EXPLORE_PAGE_SEARCH_SIZE } from "@/lib/constants";
import { ERROR_MESSAGES } from "@/lib/messages";
import { Question } from "@/types/question";
import { User } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentUserId } from "./useCurrentUserId";

export const useGetUsers = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ["users", search || ""],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("limit", String(EXPLORE_PAGE_SEARCH_SIZE));
      params.set("offset", String(pageParam * EXPLORE_PAGE_SEARCH_SIZE));
      if (search) params.set("search", search);

      const res = await fetch(`/api/users?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.USERS.FETCH.PLURAL);
      }

      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === EXPLORE_PAGE_SEARCH_SIZE ? allPages.length : undefined,
  });
};

export const useGetUserById = (userId: number) => {
  const currentUserId = useCurrentUserId();
  const { showSnackbar } = useSnackbarContext();

  const query = useQuery({
    queryKey: ["user", userId, currentUserId],
    enabled: !!userId,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentUserId) {
        params.set("viewerId", String(currentUserId));
      }

      const res = await fetch(`/api/users/${userId}?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.USERS.FETCH.SINGULAR);
      }

      return await res.json();
    },
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.USERS.FETCH.SINGULAR, "danger");
    }
  }, [query.isError, showSnackbar]);

  return query;
};

export const useUpdateUser = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await fetch(`/api/users/${currentUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.USERS.UPDATE);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.USERS.UPDATE, "danger");
    },
  });
};

export const useGetUserQuestions = (userId: number, enabled: boolean = true) => {
  const currentUserId = useCurrentUserId();
  const { ready } = usePrivy();

  return useQuery<Question[]>({
    queryKey: ["user-questions", userId, currentUserId],
    enabled: enabled && !!userId && ready,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentUserId) {
        params.set("viewerId", String(currentUserId));
      }

      const res = await fetch(`/api/users/${userId}/questions?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.USERS.FETCH.QUESTIONS);
      }

      return await res.json();
    },
  });
};

export const useGetUserAnsweredQuestions = (userId: number, enabled: boolean = true) => {
  const currentUserId = useCurrentUserId();
  const { ready } = usePrivy();

  return useQuery({
    queryKey: ["user-answers", userId, currentUserId],
    enabled: enabled && !!userId && ready,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentUserId) {
        params.set("viewerId", String(currentUserId));
      }

      const res = await fetch(`/api/users/${userId}/answers?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.USERS.FETCH.ANSWERED_QUESTIONS);
      }

      return await res.json();
    },
  });
};
