import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { core } from "../schemas";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function requireAuthUser(client: ServerSupabaseClient) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) redirect("/auth");

  return user;
}

export async function requireReadyProfile(client: ServerSupabaseClient) {
  const user = await requireAuthUser(client);
  const { data: profile, error } = await core(client)
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile?.display_name) redirect("/setup");

  return { user, profile };
}
