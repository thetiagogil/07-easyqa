import { useSnackbarContext } from "@/contexts/snackbar.context";
import { NOTIFICATIONS_PAGE_SIZE } from "@/lib/constants";
import { ERROR_MESSAGES } from "@/lib/messages";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserId } from "./useCurrentUserId";

export const useGetNotifications = () => {
  const currentUserId = useCurrentUserId();

  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", currentUserId],
    enabled: !!currentUserId,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("userId", String(currentUserId));
      params.set("limit", String(NOTIFICATIONS_PAGE_SIZE));
      params.set("offset", String(pageParam * NOTIFICATIONS_PAGE_SIZE));

      const res = await fetch(`/api/notifications?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.NOTIFICATIONS.FETCH);
      }

      return await res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === NOTIFICATIONS_PAGE_SIZE ? allPages.length : undefined,
  });
};

export const useGetUnreadNotificationsCount = () => {
  const currentUserId = useCurrentUserId();

  return useQuery({
    queryKey: ["notifications", "unreadCount", currentUserId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("userId", String(currentUserId));

      const res = await fetch(`/api/notifications/unread-count?${params}`);

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.NOTIFICATIONS.FETCH_COUNT);
      }

      return await res.json();
    },
    enabled: !!currentUserId,
  });
};

export const useReadAllNotifications = () => {
  const currentUserId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        body: JSON.stringify({ userId: currentUserId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.NOTIFICATIONS.MARK_READ);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
    onError: () => {
      showSnackbar(ERROR_MESSAGES.NOTIFICATIONS.MARK_READ, "danger");
    },
  });
};
