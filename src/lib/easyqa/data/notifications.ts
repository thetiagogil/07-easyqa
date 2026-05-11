import { LIMITS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/types/easyqa";
import { mapNotification } from "../mappers";
import { easyqa } from "../schemas";
import { getCurrentUser, requireProfile } from "./auth";
import { getProfilesByIds } from "./hydrate";

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

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const resolvedUserId = userId ?? (await getCurrentUser())?.id;
  if (!resolvedUserId) return 0;

  const client = await createClient();
  const { count, error } = await easyqa(client)
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", resolvedUserId)
    .eq("is_read", false);

  if (error) throw error;

  return count ?? 0;
}
