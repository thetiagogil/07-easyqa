"use client";
import { Loading } from "@/components/shared/loading";
import { useAuthUser } from "@/hooks/useAuthApi";
import { WithChildren } from "@/types";
import type { User } from "@/types/user";
import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useMemo } from "react";

interface AuthContextType {
  currentUser: User | null;
  isUserReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isUserReady: false,
});

export function AuthContextProvider({ children }: WithChildren) {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const { data: userData, isLoading: isLoadingUser } = useAuthUser(authenticated);

  const mergedUser: User | null =
    authenticated && userData && privyUser
      ? {
          ...userData,
          email: privyUser.email?.address,
          wallet: privyUser.wallet?.address,
        }
      : null;

  const isUserReady = useMemo(() => {
    if (!ready) return false;
    if (!authenticated) return false;
    return !!mergedUser?.name;
  }, [ready, authenticated, mergedUser]);

  if (!ready || (authenticated && isLoadingUser)) {
    return <Loading variant="overlay" />;
  }

  return (
    <AuthContext.Provider value={{ currentUser: mergedUser, isUserReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
