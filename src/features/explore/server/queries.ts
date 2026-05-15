import { LIMITS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import { core } from "@/lib/database/schemas";
import { createClient } from "@/lib/supabase/server";
import { mapProfile } from "@/shared/server/mappers";
import type { Profile } from "@/types/easyqa";

export async function searchExploreProfiles(search?: string): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const searchTerm = search?.trim();

  let query = core(client)
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true })
    .limit(LIMITS.pageSize);

  if (searchTerm) {
    query = query.or(`display_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapProfile);
}
