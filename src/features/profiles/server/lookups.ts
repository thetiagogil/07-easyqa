import { core, type AppSupabaseClient } from "@/lib/database/schemas";
import { profileMap } from "@/shared/server/mappers";
import type { ProfileRow } from "@/types/easyqa";

export const getProfilesByIds = async (
  client: AppSupabaseClient,
  ids: string[],
) => {
  const uniqueIds = Array.from(new Set(ids));
  if (!uniqueIds.length) {
    return { profilesById: new Map<string, ProfileRow>() };
  }

  const { data, error } = await core(client)
    .from("profiles")
    .select("*")
    .in("id", uniqueIds);

  if (error) throw error;

  return { profilesById: profileMap(data ?? []) };
};
