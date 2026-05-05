import { useSnackbarContext } from "@/contexts/snackbar.context";
import { ERROR_MESSAGES } from "@/lib/messages";
import { User } from "@/types/user";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAuthUser = (enabled = true) => {
  const { showSnackbar } = useSnackbarContext();
  const { logout } = usePrivy();

  const query = useQuery({
    queryKey: ["user"],
    enabled,
    queryFn: async (): Promise<User> => {
      const token = await getAccessToken();
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION);
      }

      return await res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      showSnackbar(ERROR_MESSAGES.AUTH.AUTHENTICATION, "danger");
      logout();
    }
  }, [query.isError, showSnackbar, logout]);

  return query;
};
