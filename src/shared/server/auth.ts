import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Profile } from "@/types/easyqa";
import { core, type AppSupabaseClient } from "@/lib/database/schemas";
import { mapProfile } from "@/shared/server/mappers";

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured()) return null;

  const client = await createClient();
  const user = await getCurrentAuthUser(client);

  if (!user) return null;

  const { data: profile, error } = await core(client)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return {
    id: user.id,
    email: user.email ?? null,
    profile: profile ? mapProfile(profile) : null,
  };
};

export const requireUser = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth");

  return currentUser;
};

export const requireProfile = async () => {
  const currentUser = await requireUser();
  if (!currentUser.profile?.hasDisplayName) {
    redirect("/setup");
  }

  return currentUser as CurrentUser & { profile: Profile };
};

export const getCurrentAuthUser = async (client: AppSupabaseClient) => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) return null;

  return user;
};

export const requireAuthUser = async (client: AppSupabaseClient) => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) redirect("/auth");

  return user;
};

export const requireReadyProfile = async (client: AppSupabaseClient) => {
  const user = await requireAuthUser(client);
  const { data: profile, error } = await core(client)
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile?.display_name) redirect("/setup");

  return { user, profile };
};
