import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "@/lib/database/schemas";
import { getCurrentUser } from "@/shared/server/auth";

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
