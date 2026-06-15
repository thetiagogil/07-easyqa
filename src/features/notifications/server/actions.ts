"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "@/lib/database/schemas";
import { requireReadyProfile } from "@/shared/server/auth";
import { emptyState } from "@/shared/server/action-state";
import type { ActionState } from "@/shared/types";

export async function markNotificationsReadAction(
  _state: ActionState = emptyState,
): Promise<ActionState> {
  void _state;
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("mark_my_notifications_read");

  if (error) return { error: error.message };

  revalidatePath("/notifications");
  return { success: "Notifications marked read." };
}
