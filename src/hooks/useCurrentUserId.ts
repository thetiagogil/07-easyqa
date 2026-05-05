import { useAuthContext } from "@/contexts/auth.context";

export const useCurrentUserId = () => {
  const { currentUser } = useAuthContext();
  return currentUser?.id ?? null;
};
