import { LIMITS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/types/easyqa";
import { easyqa } from "@/lib/database/schemas";
import { requireProfile } from "@/shared/server/auth";
import { getProfilesByIds } from "@/shared/server/qa/hydrate";
import { mapNotification } from "@/shared/server/qa/mappers";

export async function getNotifications(): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const currentUser = await requireProfile();
  const client = await createClient();

  const { data, error } = await easyqa(client)
    .from("notifications")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (error) throw error;
  if (!data?.length) return [];

  const { profilesById } = await getProfilesByIds(
    client,
    data.map((notification) => notification.actor_id).filter(Boolean) as string[],
  );

  return data.map((notification) =>
    mapNotification(
      notification,
      notification.actor_id ? profilesById.get(notification.actor_id) ?? null : null,
    ),
  );
}
