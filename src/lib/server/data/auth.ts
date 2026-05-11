import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Profile } from "@/types/easyqa";
import { mapProfile } from "../mappers";
import { core, type AppSupabaseClient } from "../schemas";

export async function getCurrentUser(): Promise<CurrentUser | null> {
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
}

export async function requireUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth");

  return currentUser;
}

export async function requireProfile() {
  const currentUser = await requireUser();
  if (!currentUser.profile?.hasDisplayName) {
    redirect("/setup");
  }

  return currentUser as CurrentUser & { profile: Profile };
}

export async function getCurrentAuthUser(client: AppSupabaseClient) {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}
